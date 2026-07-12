function yahooSymbol(symbol){
  const s=String(symbol||'').trim().toUpperCase();
  if(/^\d{6}\.SH$/.test(s)) return `${s.slice(0,6)}.SS`;
  if(/^\d{6}\.SZ$/.test(s)) return `${s.slice(0,6)}.SZ`;
  if(/^\d{6}$/.test(s)) return s.startsWith('6')?`${s}.SS`:`${s}.SZ`;
  if(/^\d{5}\.HK$/.test(s)) return `${String(parseInt(s.slice(0,5),10)).padStart(4,'0')}.HK`;
  if(/^\d{5}$/.test(s)) return `${String(parseInt(s,10)).padStart(4,'0')}.HK`;
  return s.replace(/^US/,'');
}
function eastmoneySecid(symbol){
  const s=String(symbol||'').trim().toUpperCase();
  if(/^\d{6}\.SH$/.test(s)) return `1.${s.slice(0,6)}`;
  if(/^\d{6}\.SZ$/.test(s)) return `0.${s.slice(0,6)}`;
  if(/^\d{6}$/.test(s)) return `${s.startsWith('6')?'1':'0'}.${s}`;
  if(/^\d{5}\.HK$/.test(s)) return `116.${s.slice(0,5)}`;
  if(/^\d{5}$/.test(s)) return `116.${s}`;
  return null;
}
function stooqSymbol(symbol){
  const s=String(symbol||'').trim().toLowerCase();
  if(/^\d{6}\.sh$/.test(s)) return `${s.slice(0,6)}.cn`;
  if(/^\d{6}\.sz$/.test(s)) return `${s.slice(0,6)}.cn`;
  if(/^\d{6}$/.test(s)) return `${s}.cn`;
  if(/^\d{5}\.hk$/.test(s)) return `${String(parseInt(s.slice(0,5),10))}.hk`;
  if(/^\d{5}$/.test(s)) return `${String(parseInt(s,10))}.hk`;
  return `${s.replace(/^us/,'')}.us`;
}
function averageLast(vals,n,endExclusive){
  const end=endExclusive==null?vals.length:endExclusive;
  const start=end-n;
  if(start<0) return NaN;
  const slice=vals.slice(start,end);
  if(slice.length<n) return NaN;
  return slice.reduce((a,b)=>a+b,0)/n;
}
function calcMA3060(points){
  const rows=points.map(p=>({date:p.date,close:Number(p.close)})).filter(p=>Number.isFinite(p.close));
  const closes=rows.map(p=>p.close);
  if(closes.length<61) throw new Error(`日线点不足：${closes.length}`);
  const price=closes[closes.length-1];
  const prevClose=closes[closes.length-2];
  const ma30=averageLast(closes,30);
  const ma60=averageLast(closes,60);
  const prevMa30=averageLast(closes,30,closes.length-1);
  const prevMa60=averageLast(closes,60,closes.length-1);
  const diff=ma30-ma60, prevDiff=prevMa30-prevMa60;
  const rel=Math.abs(diff)/(ma60||1);
  const ma30Slope=(ma30-prevMa30)/(prevMa30||1)*100;
  const ma60Slope=(ma60-prevMa60)/(prevMa60||1)*100;
  const bias30=(price-ma30)/(ma30||1)*100;
  const bias60=(price-ma60)/(ma60||1)*100;
  let status='below', label='均线弱势', boost=-2, message='30日均价仍在60日均价下方，中期趋势尚未转强。';
  if(prevDiff<=0 && diff>0){
    status='golden_cross'; label='30/60均线金叉'; boost=6;
    message='30日均价刚刚上穿60日均价，中期趋势转强观察。';
  }else if(diff>0){
    status='above'; label='均线上方保持'; boost=3;
    message='30日均价保持在60日均价上方，中期趋势仍有支撑。';
  }else if(rel<0.006){
    status='near'; label='均线临界观察'; boost=1;
    message='30日均价接近60日均价，处在趋势临界区，需等待确认。';
  }
  let observeScore=50;
  if(ma30>ma60) observeScore+=18; else observeScore-=12;
  if(price>ma30) observeScore+=10; else observeScore-=8;
  if(ma30Slope>0) observeScore+=8; else observeScore-=5;
  if(ma60Slope>0) observeScore+=8; else observeScore-=5;
  if(Math.abs(bias30)<=4) observeScore+=8;
  if(bias30>9) observeScore-=16;
  if(price<ma60) observeScore-=18;
  observeScore=Math.max(0,Math.min(100,Math.round(observeScore)));
  const riskLabel=bias30>9?'乖离偏高':(price<ma60?'结构破位':(ma30>ma60?'趋势观察':'等待确认'));
  return {
    status,label,boost,message,
    price:+price.toFixed(4), prevClose:+prevClose.toFixed(4),
    date:rows[rows.length-1]?.date || '',
    ma30:+ma30.toFixed(4), ma60:+ma60.toFixed(4),
    prevMa30:+prevMa30.toFixed(4), prevMa60:+prevMa60.toFixed(4),
    ma30Slope:+ma30Slope.toFixed(3), ma60Slope:+ma60Slope.toFixed(3),
    bias30:+bias30.toFixed(3), bias60:+bias60.toFixed(3),
    observeScore, riskLabel
  };
}
async function fetchYahoo(symbol){
  const ys=yahooSymbol(symbol);
  const url=`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ys)}?range=9mo&interval=1d`;
  const res=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}});
  if(!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
  const obj=await res.json();
  const r=obj?.chart?.result?.[0];
  const closes=r?.indicators?.quote?.[0]?.close;
  const times=r?.timestamp;
  if(!Array.isArray(closes) || closes.length<61) throw new Error(`Yahoo日线点不足：${closes?closes.length:0}`);
  const pts=closes.map((c,i)=>({date:times?.[i]?new Date(times[i]*1000).toISOString().slice(0,10):String(i), close:Number(c)})).filter(x=>Number.isFinite(x.close));
  if(pts.length<61) throw new Error(`Yahoo可解析点不足：${pts.length}`);
  return {points:pts, source:`Yahoo Chart(${ys})`};
}
async function fetchStooq(symbol){
  const ss=stooqSymbol(symbol);
  const url=`https://stooq.com/q/d/l/?s=${encodeURIComponent(ss)}&i=d`;
  const res=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}});
  if(!res.ok) throw new Error(`Stooq HTTP ${res.status}`);
  const csv=await res.text();
  const lines=csv.trim().split(/\r?\n/).filter(Boolean);
  if(lines.length<62) throw new Error(`Stooq CSV行数不足：${lines.length}`);
  const head=lines[0].toLowerCase().split(',');
  const dateIdx=head.indexOf('date'), closeIdx=head.indexOf('close');
  if(dateIdx<0 || closeIdx<0) throw new Error('Stooq CSV缺少Date/Close列');
  const pts=lines.slice(1).map(line=>{
    const p=line.split(',');
    return {date:p[dateIdx],close:parseFloat(p[closeIdx])};
  }).filter(x=>Number.isFinite(x.close)).sort((a,b)=>a.date.localeCompare(b.date));
  if(pts.length<61) throw new Error(`Stooq可解析点不足：${pts.length}`);
  return {points:pts, source:`Stooq(${ss})`};
}
async function fetchEastmoney(symbol){
  const secid=eastmoneySecid(symbol);
  if(!secid) throw new Error('东方财富暂不支持该代码');
  const fields1='f1,f2,f3,f4,f5,f6';
  const fields2='f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61';
  const url=`https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${encodeURIComponent(secid)}&fields1=${fields1}&fields2=${fields2}&klt=101&fqt=1&beg=0&end=20500101&lmt=180`;
  const res=await fetch(url,{headers:{'user-agent':'Mozilla/5.0','referer':'https://quote.eastmoney.com/'}});
  if(!res.ok) throw new Error(`东方财富 HTTP ${res.status}`);
  const obj=await res.json();
  const arr=obj?.data?.klines;
  if(!Array.isArray(arr)||arr.length<61) throw new Error(`东方财富日线点不足：${arr?arr.length:0}`);
  const pts=arr.map(line=>{
    const p=String(line).split(',');
    return {date:p[0],close:parseFloat(p[2])};
  }).filter(x=>Number.isFinite(x.close));
  if(pts.length<61) throw new Error(`东方财富可解析点不足：${pts.length}`);
  return {points:pts.sort((a,b)=>a.date.localeCompare(b.date)), source:`东方财富(${secid})`};
}

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate=86400');
  const symbol=String(req.query.symbol||'').trim();
  if(!symbol){
    res.status(400).json({ok:false,error:'missing symbol'});
    return;
  }
  const attempts=[];
  const sources=[
    ['Yahoo Chart',()=>fetchYahoo(symbol)],
    ['东方财富日线',()=>fetchEastmoney(symbol)],
    ['Stooq CSV',()=>fetchStooq(symbol)]
  ];
  for(const [name,fn] of sources){
    try{
      const out=await fn();
      const sig=calcMA3060(out.points);
      res.status(200).json({ok:true,symbol,source:out.source,attempts:[...attempts,{name,ok:true,msg:out.source}],...sig});
      return;
    }catch(e){
      attempts.push({name,ok:false,msg:e.message||String(e)});
    }
  }
  res.status(200).json({
    ok:false,
    symbol,
    source:'Vercel K线代理',
    status:'unknown',
    label:'均线信号待确认',
    boost:0,
    ma30:null,
    ma60:null,
    message:'Vercel K线代理未能获取到足够历史日线。',
    attempts,
    error:attempts.map(a=>`${a.name}: ${a.msg}`).join('；')
  });
}