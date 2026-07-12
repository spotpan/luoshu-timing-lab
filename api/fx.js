import { fetchUsdRates, json } from './_market.js';

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=3600');
  try{
    const rates=await fetchUsdRates();
    json(res,200,{ok:true,base:'USD',rates});
  }catch(e){
    json(res,200,{ok:false,error:e.message||String(e)});
  }
}
