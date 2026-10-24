// ui_kits/rem-core/SystemStatus.jsx
function SystemStatus() {
  const stats = [
    { l:'Active Signals',   v:'847',    c:'cyan'   },
    { l:'Anomalies',        v:'23',     c:'orange' },
    { l:'Records Indexed',  v:'12.4M',  c:'purple' },
    { l:'Uptime',           v:'99.2%',  c:'green'  },
    { l:'Median Latency',   v:'42ms',   c:'cyan'   },
    { l:'Active Operators', v:'14',     c:'cyan'   },
  ];
  const bars = [
    { l:'GPU',    p:85, c:'orange' },
    { l:'MEM',    p:64, c:'cyan'   },
    { l:'INGEST', p:38, c:'purple' },
    { l:'SIGNAL', p:92, c:'green'  },
  ];
  return (
    <aside className="sys-status">
      <div className="ss-section">
        <div className="ss-title">SYSTEM <span>// REM-CORE</span></div>
        <div className="ss-grid">
          {stats.map(s => (
            <div key={s.l} className="ss-stat">
              <div className={'ss-v ss-'+s.c}>{s.v}</div>
              <div className="ss-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="ss-section">
        <div className="ss-title">LOAD <span>// REAL-TIME</span></div>
        {bars.map(b => (
          <div key={b.l} className="ss-bar">
            <div className="ss-bar-head">
              <span className="ss-bar-l">{b.l}</span>
              <span className={'ss-bar-v ss-'+b.c}>{b.p}%</span>
            </div>
            <div className="ss-bar-track">
              <div className={'ss-bar-fill ss-fill-'+b.c} style={{width: b.p+'%'}}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="ss-section">
        <div className="ss-title">AGENTS <span>// 3 ACTIVE</span></div>
        <div className="ss-agent"><span className="ss-av" style={{background:'#3b82f6'}}>A1</span><span>Atlas · planner</span><span className="ss-pulse"></span></div>
        <div className="ss-agent"><span className="ss-av" style={{background:'#8b5cf6'}}>A2</span><span>Vesper · researcher</span><span className="ss-pulse"></span></div>
        <div className="ss-agent"><span className="ss-av" style={{background:'#10b981'}}>A3</span><span>Castor · synth</span><span className="ss-pulse"></span></div>
      </div>
    </aside>
  );
}
window.SystemStatus = SystemStatus;
