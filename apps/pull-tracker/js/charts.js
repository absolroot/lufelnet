(() => {
    function drawOverviewChart(canvas, blocks, key, lang){
        try {
            const ctx = canvas.getContext('2d');
            const nowReal = new Date();
            const msDay = 24*60*60*1000;
            const arr = (key==='pickup') ? [blocks.pickup[0], blocks.pickup[1]] : (key==='weapon' ? blocks.weapon : [blocks.standard[0], blocks.standard[1]]);
            const allRecords = arr.flatMap(b => (b && Array.isArray(b.records)) ? b.records.flatMap(s => Array.isArray(s.record)? s.record:[]) : []);
            const maxTs = allRecords.reduce((m,r)=> Math.max(m, Number(r.timestamp||0)), 0);
            const end = new Date(Math.max(0, Math.min(Number(nowReal), maxTs || Number(nowReal))));
            const start90 = new Date(end.getTime() - 89*msDay);
            const monthKey = (d)=> d.getFullYear()*100 + (d.getMonth()+1);
            const monthLabel = (d)=> `${String(d.getFullYear()).slice(-2)}-${String(d.getMonth()+1).padStart(2,'0')}`;
            const detectMinTs = (records)=> records.reduce((m,r)=> Math.min(m, Number(r.timestamp||Infinity)), Infinity);
            const minTs = detectMinTs(allRecords);
            const startMonth = isFinite(minTs) ? new Date(new Date(minTs).getFullYear(), new Date(minTs).getMonth(), 1) : new Date(start90.getFullYear(), start90.getMonth(), 1);
            const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1);
            const allBins = [];
            for (let d=new Date(startMonth); d<=lastMonth; d=new Date(d.getFullYear(), d.getMonth()+1, 1)) allBins.push(new Date(d));
            const bins = allBins.slice(-6);
            const binCount = Math.max(1, bins.length);
            const monthLabels = bins.map(monthLabel);
            const idxByKey = new Map(bins.map((d,i)=> [monthKey(d), i]));
            const totals = new Array(binCount).fill(0);
            const avg5 = new Array(binCount).fill(null).map(()=>({sum:0,count:0}));
            for (const r of allRecords){
                const t = Number(r.timestamp||0); if (!t) continue; const dt = new Date(t); if (dt < start90 || dt > end) continue;
                const idx = idxByKey.get(monthKey(new Date(dt.getFullYear(), dt.getMonth(), 1))); if (idx==null) continue; totals[idx]++;
            }
            // 5★ 평균: 실제 기록 연속에서 5★가 발생할 때마다 그 직전까지의 pity를 월별로 집계
            const sortedSegments = arr.flatMap(b => (b && Array.isArray(b.records)) ? b.records : []);
            const chain = [];
            for (const seg of sortedSegments){
                const recs = Array.isArray(seg.record) ? seg.record : [];
                for (const r of recs) chain.push(r);
            }
            chain.sort((a,b)=> Number(a.timestamp||0) - Number(b.timestamp||0));
            let pityCounter = 0;
            for (const r of chain){
                const t = Number(r.timestamp||0); if (!t) continue; const dt = new Date(t); if (dt < start90 || dt > end) continue;
                pityCounter++;
                if (Number(r.grade) === 5){
                    const idx = idxByKey.get(monthKey(new Date(dt.getFullYear(), dt.getMonth(), 1))); if (idx==null) { pityCounter=0; continue; }
                    avg5[idx].sum += pityCounter; avg5[idx].count++;
                    pityCounter = 0;
                }
            }
            const avg5Final = avg5.map(o=> o.count>0 ? (o.sum/o.count) : 0);
            const avg4 = new Array(binCount).fill(null).map(()=>({sum:0,count:0}));
            const sortedRecords = allRecords.slice().sort((a,b)=> Number(a.timestamp||0) - Number(b.timestamp||0));
            let rarePityCounter = 0;
            for (const r of sortedRecords){
                const t = Number(r.timestamp||0); if (!t) continue; const dt = new Date(t); if (dt < start90 || dt > end) continue;
                rarePityCounter++;
                const grade = Number(r.grade||0);
                if (grade === 4){
                    const idx = idxByKey.get(monthKey(new Date(dt.getFullYear(), dt.getMonth(), 1))); if (idx==null) continue;
                    avg4[idx].sum += rarePityCounter; avg4[idx].count++; rarePityCounter = 0;
                }
            }
            const avg4Final = avg4.map(o=> o.count>0 ? (o.sum/o.count) : 0);
            const dpr = window.devicePixelRatio || 1;
            const W = canvas.width = Math.max(200, Math.floor(canvas.clientWidth * dpr));
            const H = canvas.height = Math.max(100, Math.floor(canvas.clientHeight * dpr));
            ctx.setTransform(dpr,0,0,dpr,0,0);
            const vw = canvas.clientWidth; const vh = canvas.clientHeight;
            const pad=28; const chartW=vw-pad*2; const chartH=vh-pad*2;
            const MAXY = (key==='pickup') ? 120 : 80; const TICK=20;
            const xAt = (i)=> pad + (chartW*(i/(binCount-1)));
            const yAt = (v)=> pad + chartH - (chartH*(Math.min(v, MAXY)/MAXY));
            ctx.fillStyle = 'rgba(40, 40, 40, 0)'; ctx.fillRect(0,0,vw,vh);
            ctx.strokeStyle='rgba(255,255,255,.08)'; ctx.lineWidth=1; ctx.beginPath();
            ctx.fillStyle='rgba(255,255,255,.6)'; ctx.font='10px sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle';
            for (let val=0; val<=MAXY; val+=TICK){ const y=yAt(val); ctx.moveTo(pad, y); ctx.lineTo(vw-pad, y); ctx.fillText(String(val), pad-4, y); }
            ctx.stroke();
            ctx.save(); ctx.globalAlpha=0.7; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2; ctx.beginPath();
            for (let i=0;i<binCount;i++){ const y=yAt(totals[i]); if (i===0) ctx.moveTo(xAt(i), y); else ctx.lineTo(xAt(i), y); }
            ctx.stroke(); ctx.globalAlpha=1; ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.font='10px sans-serif';
            for (let i=0;i<binCount;i++){
                const x=xAt(i); const y=yAt(totals[i]);
                ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
                // 점 옆에 총 횟수 숫자 라벨 복구
                ctx.fillText(String(totals[i]||0), x, y-6);
            }
            ctx.restore();
            ctx.strokeStyle='#8fd9ff'; ctx.lineWidth=2; ctx.beginPath();
            for (let i=0;i<binCount;i++){ const y=yAt(avg5Final[i]); if (i===0) ctx.moveTo(xAt(i), y); else ctx.lineTo(xAt(i), y); }
            ctx.stroke(); ctx.fillStyle='#8fd9ff'; ctx.textAlign='center'; ctx.textBaseline='bottom';
            for (let i=0;i<binCount;i++){ const x=xAt(i); const y=yAt(avg5Final[i]); ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI*2); ctx.fill(); }
            ctx.strokeStyle='#ffc17c'; ctx.lineWidth=2; ctx.beginPath();
            for (let i=0;i<binCount;i++){ const y=yAt(avg4Final[i]); if (i===0) ctx.moveTo(xAt(i), y); else ctx.lineTo(xAt(i), y); }
            ctx.stroke(); ctx.fillStyle='#ffc17c'; ctx.textAlign='center'; ctx.textBaseline='bottom';
            for (let i=0;i<binCount;i++){ const x=xAt(i); const y=yAt(avg4Final[i]); ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI*2); ctx.fill(); }
            ctx.fillStyle='rgba(255,255,255,.7)'; ctx.font='10px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top';
            for (let i=0;i<binCount;i++){ ctx.fillText(monthLabels[i], xAt(i), vh-14); }
        } catch(_) {}
    }
    window.drawOverviewChart = drawOverviewChart;
})();


