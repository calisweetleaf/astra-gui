// ui_kits/somnus/App.jsx
const { useState } = React;

const SEED = [
  { role: 'user', text: 'Pull the latest correlation between Founders Fund and Anduril contracts. Brief format.' },
  { role: 'agent', name: 'Atlas',  subtitle: 'planner',    tag: 'A1', color: '#3b82f6',
    text: 'Decomposing into three sub-tasks: corpus crawl, correlation scoring, brief draft. Routing the crawl to Vesper now.' },
  { role: 'agent', name: 'Vesper', subtitle: 'researcher', tag: 'A2', color: '#8b5cf6',
    text: '47 documents pulled. Top correlation hit: 0.89 on shared board overlap and three concurrent contract awards. Sending to Atlas.' },
];

function App() {
  const [active, setActive] = useState('chat');
  const [draft, setDraft]   = useState('');
  const [messages, setMessages] = useState(SEED);
  const [showHero, setShowHero] = useState(false);

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMessages(m => [...m, { role: 'user', text: t }]);
    setDraft('');
    setShowHero(false);
    setTimeout(() => {
      setMessages(m => [...m, {
        role:'agent', name:'Atlas', subtitle:'planner', tag:'A1', color:'#3b82f6',
        text: 'Acknowledged. Spinning up sub-agents — first checkpoint in 90s.'
      }]);
    }, 600);
  };

  return (
    <div className="app">
      <Sidebar active={active} onSelect={setActive} />
      <div className="main">
        <div className="main-body">
          {showHero
            ? <WelcomeHero onPick={() => setShowHero(false)} />
            : <MessageThread messages={messages} />}
        </div>
        <Composer value={draft} onChange={setDraft} onSend={send} />
        <StatusFooter />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
