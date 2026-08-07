import { useState, useEffect, useMemo } from 'react';

function App() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [positionFilter, setPositionFilter] = useState('All');
  const [sortField, setSortField] = useState('total_points');
  const [sortDirection, setSortDirection] = useState('desc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
    const positionMatch = positionFilter === 'All' || positionsById[player.element_type] === positionFilter;

    const price = player.now_cost / 10;
    const minMatch = minPrice === '' || price >= parseFloat(minPrice);
    const maxMatch = maxPrice === '' || price <= parseFloat(maxPrice);

    return positionMatch && minMatch && maxMatch;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'team') {
      aVal = teamsById[aVal];
      bVal = teamsById[bVal];
    }

    if (sortField === 'ict_index') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

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
      <input
      type="number"
      placeholder="Min price"
      value={minPrice}
      onChange={e => setMinPrice(e.target.value)}
      step="0.1"
    />
    <input
      type="number"
      placeholder="Max price"
      value={maxPrice}
      onChange={e => setMaxPrice(e.target.value)}
      step="0.1"
    />
  
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('web_name')} style={{ cursor: 'pointer' }}>
              Name {sortField === 'web_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('team')} style={{ cursor: 'pointer' }}>
              Team {sortField === 'team' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Position</th>
            <th onClick={() => handleSort('now_cost')} style={{ cursor: 'pointer' }}>
              Price {sortField === 'now_cost' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('ict_index')} style={{ cursor: 'pointer' }}>
              ICT {sortField === 'ict_index' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('defensive_contribution')} style={{ cursor: 'pointer' }}>
              DefCon {sortField === 'defensive_contribution' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('defensive_contribution_per_90')} style={{ cursor: 'pointer' }}>
              DefCon/90 {sortField === 'defensive_contribution_per_90' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('bonus')} style={{ cursor: 'pointer' }}>
              Bonus {sortField === 'bonus' && (sortDirection === 'asc' ? '↑' : '↓')}
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
              <td>{parseFloat(player.ict_index).toFixed(1)}</td>
              <td>{player.defensive_contribution}</td>
              <td>{player.defensive_contribution_per_90.toFixed(1)}</td>
              <td>{player.bonus}</td>
              <td>{player.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;