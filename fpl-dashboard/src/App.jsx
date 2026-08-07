import { useState, useEffect, useMemo } from 'react';

function App() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [positionFilter, setPositionFilter] = useState('All');
  const [sortField, setSortField] = useState('total_points');
  const [sortDirection, setSortDirection] = useState('desc');

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

  const filteredPlayers = players.filter(player => {
  if (positionFilter === 'All') return true;
  return positionsById[player.element_type] === positionFilter;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
  const aVal = a[sortField];
  const bVal = b[sortField];
  return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div>
      <h1>FPL Dashboard</h1>
      <p>Loaded {players.length} players</p>
      
      <select value={positionFilter} onChange={e => setPositionFilter(e.target.value)}>
        <option value="All">All Positions</option>
        <option value="Goalkeeper">Goalkeeper</option>
        <option value="Defender">Defender</option>
        <option value="Midfielder">Midfielder</option>
        <option value="Forward">Forward</option>
      </select>
  
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Position</th><th onClick={() => handleSort('now_cost')} style={{ cursor: 'pointer' }}>
              Price {sortField === 'now_cost' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('total_points')} style={{ cursor: 'pointer' }}>
              Points {sortField === 'total_points' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          
          {sortedPlayers.map(player => (
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