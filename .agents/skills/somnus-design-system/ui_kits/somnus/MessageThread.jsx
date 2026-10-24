// ui_kits/somnus/MessageThread.jsx
function MessageThread({ messages }) {
  return (
    <div className="thread">
      {messages.map((m, i) => (
        <div key={i} className={'msg msg-' + m.role}>
          {m.role !== 'user' && (
            <div className="msg-av" style={{ background: m.color || '#3b82f6' }}>
              {m.tag || 'AI'}
            </div>
          )}
          <div className="msg-body">
            {m.role !== 'user' && (
              <div className="msg-head">
                <span className="msg-name">{m.name}</span>
                {m.subtitle && <span className="msg-sub"> · {m.subtitle}</span>}
              </div>
            )}
            <div className="msg-text">{m.text}</div>
          </div>
          {m.role === 'user' && <div className="msg-av msg-av-user">OP</div>}
        </div>
      ))}
    </div>
  );
}
window.MessageThread = MessageThread;
