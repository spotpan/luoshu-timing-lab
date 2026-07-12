import { getSupabase, setupMissingPayload, ensureUser, getOrCreateAccount } from './_supabase.js';
import { parseBody, json } from './_market.js';

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,X-Luoshu-User');
  if(req.method==='OPTIONS'){res.status(204).end();return;}
  try{
    const sb=getSupabase();
    const body=parseBody(req);
    const user_id=String(req.query.user_id || body.user_id || req.headers['x-luoshu-user'] || '').trim();
    if(!user_id){json(res,400,{ok:false,error:'missing user_id'});return;}
    if(req.method==='POST'){
      const action=String(body.action||req.query.action||'init');
      const amount=Math.max(1,Number(body.initial_cash_usd||100000));
      await ensureUser(sb,user_id);
      if(action==='reset'){
        await sb.from('portfolio_accounts').update({status:'reset'}).eq('user_id',user_id).eq('status','active');
        await sb.from('virtual_positions').update({status:'reset'}).eq('user_id',user_id).eq('status','open');
      }
      const acc=await getOrCreateAccount(sb,user_id,amount);
      json(res,200,{ok:true,account:acc});
      return;
    }
    const acc=await getOrCreateAccount(sb,user_id,100000);
    json(res,200,{ok:true,account:acc});
  }catch(e){
    if(e.code==='setup_missing'){json(res,200,setupMissingPayload(e));return;}
    json(res,500,{ok:false,error:e.message||String(e)});
  }
}
