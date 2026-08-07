import { useState, useEffect } from 'react';

function TeamView() {
  const [teamId, setTeamId] = useState('106836');
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teamId) return;

    setError(null);
    setTeamData(null);

    fetch(`/api/fpl/entry/${teamId}/`)
      .then(res => {
        if (!res.ok) throw new Error('Team not found');
        return res.json();
      })
      .then(data => setTeamData(data))
      .catch(err => setError(err.message));
  }, [teamId]);

  return (
    <div>
      <h1>My Team</h1>
      <input
        type="text"
        placeholder="Enter your FPL team ID"
        value={teamId}
        onChange={e => setTeamId(e.target.value)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {teamData && (
        <div>
          <h2>{teamData.name}</h2>
          <p>Manager: {teamData.player_first_name} {teamData.player_last_name}</p>
          <p>Overall Points: {teamData.summary_overall_points}</p>
          <p>Overall Rank: {teamData.summary_overall_rank}</p>
        </div>
      )}
    </div>
  );
}

export default TeamView;