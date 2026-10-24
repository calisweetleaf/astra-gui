// ui_kits/somnus/Composer.jsx
function Composer({ value, onChange, onSend }) {
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } };
  return (
    <div className="composer-wrap">
      <div className="composer">
        <button className="composer-btn" title="Voice"><i className="fas fa-microphone"></i></button>
        <button className="composer-btn" title="Camera"><i className="fas fa-camera"></i></button>
        <button className="composer-btn" title="Attach"><i className="fas fa-paperclip"></i></button>
        <input
          className="composer-input"
          placeholder="Ask Somnus anything…  no filters, no quotas."
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="composer-btn ghost" title="Research"><i className="fas fa-microscope"></i></button>
        <button className="composer-btn send" title="Send" onClick={onSend}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      <div className="composer-meta">
        <span><i className="fas fa-bolt"></i> Unlimited</span>
        <span className="dot-sep">·</span>
        <span>Local model · 70B</span>
        <span className="dot-sep">·</span>
        <span>0 retention</span>
      </div>
    </div>
  );
}
window.Composer = Composer;
