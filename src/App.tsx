import React, { useState } from "react";
import "./App.css";

interface Player {
   id: string;
   name: string;
   scores: number[];
   total: number;
}

function App() {
   const [players, setPlayers] = useState<Player[]>([]);
   const [newPlayerName, setNewPlayerName] = useState("");
   const [gameStarted, setGameStarted] = useState(false);

   const addPlayer = () => {
      if (newPlayerName.trim() && !gameStarted) {
         const newPlayer: Player = {
            id: Date.now().toString(),
            name: newPlayerName.trim(),
            scores: [],
            total: 0,
         };
         setPlayers([...players, newPlayer]);
         setNewPlayerName("");
      }
   };

   const removePlayer = (playerId: string) => {
      if (!gameStarted) {
         setPlayers(players.filter((player) => player.id !== playerId));
      }
   };

   const startGame = () => {
      if (players.length >= 2) {
         setGameStarted(true);
         // Add first round with empty scores
         setPlayers(players.map((player) => ({ ...player, scores: [0] })));
      }
   };

   const addRound = () => {
      setPlayers(players.map((player) => ({ ...player, scores: [...player.scores, 0] })));
   };

   const updateScore = (playerId: string, roundIndex: number, score: string) => {
      const numScore = parseInt(score) || 0;
      setPlayers(
         players.map((player) => {
            if (player.id === playerId) {
               const newScores = [...player.scores];
               newScores[roundIndex] = numScore;
               const newTotal = newScores.reduce((sum, s) => sum + s, 0);
               return { ...player, scores: newScores, total: newTotal };
            }
            return player;
         })
      );
   };

   const resetGame = () => {
      setPlayers(players.map((player) => ({ ...player, scores: [], total: 0 })));
      setGameStarted(false);
   };

   const getMaxRounds = () => {
      return Math.max(...players.map((player) => player.scores.length), 0);
   };

   const getTopPlayers = () => {
      return [...players].sort((a, b) => b.total - a.total).slice(0, 3);
   };

   const getMedalIcon = (playerId: string) => {
      const topPlayers = getTopPlayers();
      const playerIndex = topPlayers.findIndex((player) => player.id === playerId);

      switch (playerIndex) {
         case 0:
            return "🥇";
         case 1:
            return "🥈";
         case 2:
            return "🥉";
         default:
            return "";
      }
   };

   return (
      <div className="App">
         <header className="App-header">
            <h1>🅰️ Scrabble Score Sheet</h1>
         </header>

         <main className="App-main">
            {!gameStarted ? (
               <div className="setup-section">
                  <h2>Game Setup</h2>
                  <div className="add-player">
                     <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="Enter player name"
                        onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                     />
                     <button onClick={addPlayer} disabled={!newPlayerName.trim()}>
                        Add Player
                     </button>
                  </div>

                  {players.length > 0 && (
                     <div className="players-list">
                        <h3>Players ({players.length})</h3>
                        {players.map((player) => (
                           <div key={player.id} className="player-item">
                              <span>{player.name}</span>
                              <button onClick={() => removePlayer(player.id)} className="remove-btn">
                                 ✕
                              </button>
                           </div>
                        ))}
                     </div>
                  )}

                  {players.length >= 2 && (
                     <button onClick={startGame} className="start-game-btn">
                        Start Game
                     </button>
                  )}
               </div>
            ) : (
               <div className="game-section">
                  <div className="game-controls">
                     <h2>Game in Progress</h2>
                     <button onClick={addRound} className="add-round-btn">
                        + Add Round
                     </button>
                  </div>

                  <div className="score-table-container">
                     <div className="table-scroll-wrapper">
                        <table className="score-table">
                           <thead>
                              <tr>
                                 <th>
                                    <strong>Players</strong>
                                 </th>
                                 {players.map((player) => (
                                    <th key={player.id}>
                                       {player.name} <span className="medal-icon">{getMedalIcon(player.id)}</span>
                                    </th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody>
                              {Array.from({ length: getMaxRounds() }, (_, roundIndex) => (
                                 <tr key={roundIndex}>
                                    <td className="round-number">Round {roundIndex + 1}</td>
                                    {players.map((player) => (
                                       <td key={player.id}>
                                          <input
                                             type="number"
                                             value={player.scores[roundIndex] || ""}
                                             onChange={(e) => updateScore(player.id, roundIndex, e.target.value)}
                                             placeholder="0"
                                             min="0"
                                             className="score-input"
                                          />
                                       </td>
                                    ))}
                                 </tr>
                              ))}
                           </tbody>
                           <tfoot>
                              <tr>
                                 <td>
                                    <strong>Total</strong>
                                 </td>
                                 {players.map((player) => (
                                    <td key={player.id} className="total-score">
                                       {player.total}
                                    </td>
                                 ))}
                              </tr>
                           </tfoot>
                        </table>
                     </div>
                  </div>

                  <button onClick={resetGame} className="reset-btn">
                     New Game
                  </button>
               </div>
            )}
         </main>
      </div>
   );
}

export default App;
