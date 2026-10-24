// ui_kits/rem-core/App.jsx
function App() {
  return (
    <div className="app">
      <CommandHeader />
      <ThreatTicker />
      <main className="body">
        <section className="workspace">
          <h2 className="section-title">Corporate Influence · Tier 1</h2>
          <div className="entity-row">
            <EntityPanel
              name="Palantir Technologies" subtitle="Defense · Data Integration"
              threat="INST. CAPTURE" threatColor="red" accent="red"
              metrics={[
                { v:'$20.0B', l:'Valuation' },
                { v:'$800M',  l:'Pentagon Deal' },
                { v:'5',      l:'Deployments' },
                { v:'0.92',   l:'Threat Score' },
              ]} />
            <EntityPanel
              name="Anduril Industries" subtitle="Autonomous Systems"
              threat="HIGH INFLUENCE" threatColor="orange" accent="orange"
              metrics={[
                { v:'$28.0B', l:'Valuation' },
                { v:'300%',   l:'YoY Growth' },
                { v:'3',      l:'Gov Contracts' },
                { v:'0.85',   l:'Threat Score' },
              ]} />
          </div>
          <h2 className="section-title">Capital Vector · Tier 2</h2>
          <div className="entity-row">
            <EntityPanel
              name="Founders Fund" subtitle="VC · Strategic Capital"
              threat="CONCERNING" threatColor="yellow" accent="yellow"
              metrics={[
                { v:'$11B',  l:'AUM' },
                { v:'14',    l:'Mil-Adj Bets' },
                { v:'7',     l:'Board Seats' },
                { v:'0.71',  l:'Threat Score' },
              ]} />
            <EntityPanel
              name="Shield AI" subtitle="Autonomy · Software-Defined"
              threat="MONITORED" threatColor="cyan" accent="cyan"
              metrics={[
                { v:'$2.7B', l:'Valuation' },
                { v:'8',     l:'Active Programs' },
                { v:'2',     l:'JSOC Pilots' },
                { v:'0.54',  l:'Threat Score' },
              ]} />
          </div>
        </section>
        <SystemStatus />
      </main>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
