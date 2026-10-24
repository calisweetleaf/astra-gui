// ui_kits/somnus/Sidebar.jsx
function Sidebar({ active, onSelect }) {
  const items = [
    { group: 'WORKSPACE' },
    { id: 'chat',      icon: 'fa-comment',     label: 'Chat',       count: 12 },
    { id: 'artifacts', icon: 'fa-cube',        label: 'Artifacts',  count: 5 },
    { id: 'projects',  icon: 'fa-folder',      label: 'Projects',   count: 3 },
    { id: 'research',  icon: 'fa-flask',       label: 'Research' },
    { group: 'SOVEREIGN' },
    { id: 'training',  icon: 'fa-brain',       label: 'AI Training', count: 'GPU 85%' },
    { id: 'git',       icon: 'fa-git-alt',     label: 'Git Repos',   brand: true },
    { id: 'settings',  icon: 'fa-cog',         label: 'Settings' },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="../../assets/ssds-logo.png" alt="SSDS" />
        <div className="brand-text">
          <div className="brand-title">SOMNUS</div>
          <div className="brand-sub">Sovereign Systems</div>
        </div>
      </div>
      <nav className="nav">
        {items.map((it, i) => it.group ? (
          <div key={i} className="nav-group">{it.group}</div>
        ) : (
          <div key={it.id}
               className={'nav-item' + (active === it.id ? ' active' : '')}
               onClick={() => onSelect(it.id)}>
            <i className={(it.brand ? 'fab ' : 'fas ') + 'fa-fw ' + it.icon}></i>
            <span>{it.label}</span>
            {it.count != null && <span className="nav-count">{it.count}</span>}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user">
          <div className="user-av">OP</div>
          <div>
            <div className="user-name">Operator</div>
            <div className="user-role">Unlimited · Local</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
