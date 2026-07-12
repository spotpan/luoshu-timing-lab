import { createClient } from '@supabase/supabase-js';

export function supabaseConfig(){
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  return {url,key,ready:!!(url&&key)};
}

export function getSupabase(){
  const cfg=supabaseConfig();
  if(!cfg.ready){
    const err=new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.');
    err.code='setup_missing';
    throw err;
  }
  return createClient(cfg.url,cfg.key,{auth:{persistSession:false}});
}

export function setupMissingPayload(error){
  return {
    ok:false,
    code:'setup_missing',
    error:error?.message || 'Supabase is not configured.',
    need_env:['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'],
    need_sql:'Run sql/supabase_schema.sql in Supabase SQL editor.'
  };
}

export async function ensureUser(sb,user_id){
  const uid=String(user_id||'').trim();
  if(!uid) throw new Error('missing user_id');
  const {error}=await sb.from('users').upsert({id:uid},{onConflict:'id'});
  if(error) throw error;
  return uid;
}

export async function getOrCreateAccount(sb,user_id,initial_cash_usd=100000){
  await ensureUser(sb,user_id);
  const {data:existing,error:e1}=await sb.from('portfolio_accounts')
    .select('*').eq('user_id',user_id).eq('status','active').order('created_at',{ascending:false}).limit(1).maybeSingle();
  if(e1) throw e1;
  if(existing) return existing;
  const amount=Number(initial_cash_usd)||100000;
  const {data,error}=await sb.from('portfolio_accounts').insert({
    user_id,base_currency:'USD',initial_cash_usd:amount,cash_usd:amount,status:'active'
  }).select('*').single();
  if(error) throw error;
  return data;
}
