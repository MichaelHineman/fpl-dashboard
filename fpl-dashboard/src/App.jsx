import { useState, useEffect } from 'react';

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('/api/fpl/bootstrap-static/')
  .then(res => res.json())
  .then(data => setPlayers(data.elements));
}
)

  return (
    <div>
      <h1>FPL Dashboard</h1>
      <p>Loaded {players.length} players</p>
    </div>
  );
}

export default App;