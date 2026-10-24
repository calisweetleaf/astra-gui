// ui_kits/rem-core/CommandHeader.jsx
function CommandHeader() {
  return (
    <header className="cmd-header">
      <div className="cmd-rule"></div>
      <div className="cmd-row">
        <i className="fas fa-shield-halved cmd-shield"></i>
        <div className="cmd-title">REM-Core <span className="sep">//</span> Strategic Intelligence Command</div>
        <div className="cmd-spacer"></div>
        <div className="cmd-ind"><span className="dot orange"></span>Corporate <span className="v orange">HIGH</span></div>
        <div className="cmd-ind"><span className="dot red"></span>Global <span className="v red">ELEVATED</span></div>
        <div className="cmd-ind"><span className="dot green"></span>Systems <span className="v green">OPERATIONAL</span></div>
        <div className="cmd-clock">{new Date().toUTCString().slice(17,25)} UTC</div>
      </div>
    </header>
  );
}
window.CommandHeader = CommandHeader;
