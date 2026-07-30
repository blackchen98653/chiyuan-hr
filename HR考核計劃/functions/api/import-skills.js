// GET /api/import-skills → 一次性：把「季緣 SM 評核資料」舊技能匯入新表（技能評核＋班別）
// 舊 3 級對應新 2/3/4：生疏→basic、熟練→normal、精熟→skilled
// 用完可刪。需先把「季緣 SM 評核資料」分享給服務帳戶（檢視者即可）。
const SM_SHEET_ID = "1_TguMg_S_g0pvN2WpRy-pc3Ueukqj0BoKIZcjPkDd6o"; // 季緣 SM 評核資料
const DATA_SHEET_ID = "1MBtq1J4jiCc9_7VdfXKMMkSoR4aJvCsSPNVQ66C5eHs"; // 季緣HR系統_資料庫
const LEVEL_MAP = {
  "精熟": "skilled", "expert": "skilled",
  "熟練": "normal", "normal": "normal", "學習中": "normal", "可獨立": "normal",
  "生疏": "basic", "rusty": "basic", "未具備": "basic", "未接觸": "basic", "需協助": "basic",
};

let _tok = null, _exp = 0;
function b64url(bytes){ let s=""; const a=new Uint8Array(bytes); for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); }
function b64urlStr(str){ return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); }
function cleanKey(raw){ let s=String(raw==null?"":raw).trim(); if(s.charAt(0)==="{"){ try{ s=JSON.parse(s).private_key||s; }catch(e){} } else if(s.indexOf('"private_key"')>=0){ const m=s.match(/"private_key"\s*:\s*"([^"]+)"/); if(m) s=m[1]; } s=s.replace(/^\s*["']|["']\s*$/g,""); return s.replace(/\\r/g,"").replace(/\\n/g,"\n"); }
function pemToBuf(pem){ const b=pem.replace(/-----BEGIN [^-]+-----/,"").replace(/-----END [^-]+-----/,"").replace(/\s+/g,""); const bin=atob(b); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u.buffer; }
async function token(env){
  if(_tok && Date.now()<_exp) return _tok;
  const now=Math.floor(Date.now()/1000);
  const unsigned=b64urlStr(JSON.stringify({alg:"RS256",typ:"JWT"}))+"."+b64urlStr(JSON.stringify({iss:env.GOOGLE_CLIENT_EMAIL,scope:"https://www.googleapis.com/auth/spreadsheets",aud:"https://oauth2.googleapis.com/token",exp:now+3600,iat:now}));
  const key=await crypto.subtle.importKey("pkcs8",pemToBuf(cleanKey(env.GOOGLE_PRIVATE_KEY)),{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,new TextEncoder().encode(unsigned));
  const jwt=unsigned+"."+b64url(sig);
  const r=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion="+jwt});
  const j=await r.json(); if(!j.access_token) throw new Error("token error: "+JSON.stringify(j));
  _tok=j.access_token; _exp=Date.now()+3500*1000; return _tok;
}
async function api(env, path, opts){
  const t=await token(env);
  const r=await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+path,{...(opts||{}),headers:{Authorization:"Bearer "+t,"Content-Type":"application/json",...((opts&&opts.headers)||{})}});
  return r.json();
}
const tf = v => { const s=String(v).trim().toUpperCase(); return s==="V"||s==="Ｖ"||s==="1"||s==="TRUE"; };

export async function onRequest({ env }) {
  try{
    // 1. 列出 SM 表所有分頁
    const meta = await api(env, SM_SHEET_ID+"?fields=sheets.properties.title");
    const tabs = (meta.sheets||[]).map(s=>s.properties.title);
    const now = new Date().toISOString();
    const skillRows=[], shiftRows=[]; let people=0;

    // 2. 逐分頁讀取並轉檔
    for(const tab of tabs){
      const res = await api(env, SM_SHEET_ID+"/values/"+encodeURIComponent(tab+"!A1:AH"));
      const data = res.values||[]; if(data.length<2) continue;
      const head = data[0].map(h=>String(h).trim());
      for(let i=1;i<data.length;i++){
        const row=data[i]; const emp=String(row[0]||"").trim(); if(!emp) continue;
        people++;
        shiftRows.push([now, emp, tf(row[2])?1:0, tf(row[3])?1:0, tf(row[4])?1:0]);
        for(let c=5;c<head.length;c++){
          const sk=head[c]; const lv=LEVEL_MAP[String(row[c]||"").trim()];
          if(sk && lv) skillRows.push([now, tab, "(舊資料匯入)", emp, sk, lv]);
        }
      }
    }

    // 3. 先清空新表舊資料（避免重複），再寫入
    await api(env, DATA_SHEET_ID+"/values/"+encodeURIComponent("技能評核!A2:F")+":clear", {method:"POST",body:"{}"});
    await api(env, DATA_SHEET_ID+"/values/"+encodeURIComponent("班別!A2:E")+":clear", {method:"POST",body:"{}"});
    for(let i=0;i<skillRows.length;i+=500){
      await api(env, DATA_SHEET_ID+"/values/"+encodeURIComponent("技能評核!A1")+":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",{method:"POST",body:JSON.stringify({values:skillRows.slice(i,i+500)})});
    }
    for(let i=0;i<shiftRows.length;i+=500){
      await api(env, DATA_SHEET_ID+"/values/"+encodeURIComponent("班別!A1")+":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",{method:"POST",body:JSON.stringify({values:shiftRows.slice(i,i+500)})});
    }

    return new Response(JSON.stringify({ok:true, tabs:tabs.length, people, skills:skillRows.length, shifts:shiftRows.length}), {headers:{"content-type":"application/json; charset=utf-8"}});
  }catch(e){
    return new Response(JSON.stringify({ok:false, error:String(e)}), {headers:{"content-type":"application/json; charset=utf-8"}});
  }
}
