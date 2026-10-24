// ui_kits/rem-core/EntityPanel.jsx
function EntityPanel({ name, subtitle, threat, threatColor, metrics, accent }) {
  return (
    <div className={'entity ent-'+(accent||'red')}>
      <span className="corner tl"></span><span className="corner tr"></span>
      <span className="corner bl"></span><span className="corner br"></span>
      <div className="entity-head">
        <div>
          <div className="entity-name">{name}</div>
          {subtitle && <div className="entity-sub">{subtitle}</div>}
        </div>
        <div className={'threat-tag tt-'+threatColor}>{threat}</div>
      </div>
      <div className="entity-grid">
        {metrics.map((m,i) => (
          <div key={i} className="metric">
            <div className={'metric-v mv-'+(accent||'red')}>{m.v}</div>
            <div className="metric-l">{m.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.EntityPanel = EntityPanel;
