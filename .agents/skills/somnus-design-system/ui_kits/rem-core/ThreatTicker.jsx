// ui_kits/rem-core/ThreatTicker.jsx
function ThreatTicker() {
  const items = [
    { c:'red',    t:'PALANTIR USDoD CONTRACT EXPANSION DETECTED · $800M' },
    { c:'orange', t:'ANDURIL · 300% YoY GROWTH · 3 ACTIVE PENTAGON DEALS' },
    { c:'cyan',   t:'CORRELATION 0.89 · FOUNDERS FUND × ANDURIL BOARD OVERLAP' },
    { c:'yellow', t:'NEW SIGNATURE · TIER-2 MIL-CIVIL VENDOR PIVOT (n=14)' },
    { c:'green',  t:'12.4M RECORDS INDEXED · SIGNAL HEALTH NOMINAL' },
  ];
  const stream = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-tag">INTEL FEED</div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {stream.map((it, i) => (
            <span key={i} className={'ticker-item tk-'+it.c}>
              <span className="dot"></span>{it.t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
window.ThreatTicker = ThreatTicker;
