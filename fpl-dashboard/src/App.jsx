import { useState } from 'react';
import PlayerList from './pages/PlayerList';
import TeamView from './pages/TeamView';

function App() {
  const [activeTab, setActiveTab] = useState('players');

  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('players')}>Players</button>
        <button onClick={() => setActiveTab('team')}>My Team</button>
      </nav>

      {activeTab === 'players' && <PlayerList />}
      {activeTab === 'team' && <TeamView />}
    </div>
  );
}

export default App;