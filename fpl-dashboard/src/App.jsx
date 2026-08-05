import { useState, useEffect, useMemo } from 'react';

function App() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetch('/api/fpl/bootstrap-static/')
      .then(res => res.json())
      .then(data => {
        setPlayers(data.elements);
        setTeams(data.teams);
        setPositions(data.element_types);
      });
  }, []);

  const teamsById = useMemo(() => {
    return Object.fromEntries(teams.map(t => [t.id, t.name]));
  }, [teams]);

  const positionsById = useMemo(() => {
    return Object.fromEntries(positions.map(p => [p.id, p.singular_name]));
  }, [positions]);

  return (
    <div>
      <h1>FPL Dashboard</h1>
      <p>Loaded {players.length} players</p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Position</th>
            <th>Price</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.web_name}</td>
              <td>{teamsById[player.team]}</td>
              <td>{positionsById[player.element_type]}</td>
              <td>{player.now_cost / 10}</td>
              <td>{player.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;