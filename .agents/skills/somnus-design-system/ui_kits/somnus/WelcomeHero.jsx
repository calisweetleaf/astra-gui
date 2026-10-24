// ui_kits/somnus/WelcomeHero.jsx
function WelcomeHero({ onPick }) {
  const bubbles = [
    { id: 'artifacts', icon: 'fa-cube',     label: 'Artifacts',  cls: 'b-art' },
    { id: 'projects',  icon: 'fa-folder',   label: 'Projects',   cls: 'b-proj' },
    { id: 'training',  icon: 'fa-brain',    label: 'Training',   cls: 'b-train' },
    { id: 'git',       icon: 'fa-git-alt',  label: 'Git',        cls: 'b-git', brand: true },
    { id: 'research',  icon: 'fa-flask',    label: 'Research',   cls: 'b-res' },
  ];
  return (
    <div className="hero">
      <div className="hero-eyebrow">SESSION OPEN · {new Date().toLocaleDateString(undefined,{ month:'short', day:'numeric'})}</div>
      <h1 className="hero-title">Welcome back, operator</h1>
      <div className="hero-sub">All systems sovereign. What are we building?</div>
      <div className="bubbles">
        {bubbles.map(b => (
          <div key={b.id} className="bubble-wrap" onClick={() => onPick(b.id)}>
            <div className={'bubble ' + b.cls}>
              <i className={(b.brand ? 'fab ' : 'fas ') + b.icon}></i>
            </div>
            <div className="bubble-label">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.WelcomeHero = WelcomeHero;
