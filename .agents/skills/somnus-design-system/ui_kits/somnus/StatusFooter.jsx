// ui_kits/somnus/StatusFooter.jsx
function StatusFooter() {
  return (
    <footer className="status-footer">
      <div className="sf-cell"><span className="sf-dot ok"></span>Local · 70B</div>
      <div className="sf-cell"><i className="fas fa-microchip"></i> GPU 85%</div>
      <div className="sf-cell"><i className="fas fa-memory"></i> 42 GB / 64 GB</div>
      <div className="sf-cell"><i className="fas fa-network-wired"></i> Air-gapped</div>
      <div className="sf-cell"><i className="fas fa-shield-halved"></i> 0 retention</div>
      <div className="sf-spacer"></div>
      <div className="sf-cell mono">somnus@unlimited:~</div>
    </footer>
  );
}
window.StatusFooter = StatusFooter;
