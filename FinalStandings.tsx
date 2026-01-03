
import React, { useState } from 'react';
import { RoundData } from '../types';
import { TEAMS } from '../constants';

interface Props {
  allRounds: RoundData[];
}

const FinalStandings: React.FC<Props> = ({ allRounds }) => {
  const [revealStep, setRevealStep] = useState(0);

  const teamStats = TEAMS.map(team => {
    let points = 0;
    let individualWins = 0;
    
    allRounds.forEach(round => {
      round.matches.forEach(match => {
        if (match.team1Id === team.id || match.team2Id === team.id) {
          const myWins = match.results.filter(r => r.winnerTeamId === team.id).length;
          individualWins += myWins;
          if (myWins >= 3) points += 2;
          else if (myWins === 2) points += 1;
        }
      });
    });
    
    return { ...team, points, individualWins };
  });

  const sortedTeams = [...teamStats].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.individualWins - a.individualWins;
  });

  const playerStatsMap: { [name: string]: number } = {};
  TEAMS.forEach(t => t.players.forEach(p => playerStatsMap[p] = 0));
  
  allRounds.forEach(round => {
    round.matches.forEach(match => {
      match.results.forEach(res => {
        if (res.winnerTeamId) {
          const winnerName = match.assignments[res.winnerTeamId][res.slot];
          if (winnerName) playerStatsMap[winnerName]++;
        }
      });
    });
  });

  const sortedPlayers = Object.entries(playerStatsMap)
    .map(([name, wins]) => ({ name, wins }))
    .sort((a, b) => b.wins - a.wins);

  const rankedPlayers = sortedPlayers.map((p, idx, arr) => ({
    ...p,
    rank: idx > 0 && p.wins === arr[idx - 1].wins ? null : idx + 1
  }));
  
  let currentRank = 1;
  rankedPlayers.forEach((p, idx) => {
    if (p.rank) currentRank = p.rank;
    else rankedPlayers[idx].rank = currentRank;
  });

  return (
    <div className="space-y-12 animate-fadeIn pb-32">
      <div className="text-center border-b border-stone-800 pb-8">
        <span className="text-stone-500 text-xs font-bold tracking-widest uppercase">Official Records</span>
        <h2 className="text-4xl font-bold font-shogi text-stone-200 mt-2">最終成績発表</h2>
      </div>

      <div className="space-y-4">
        {[4, 3, 2, 1].map(rank => {
          const team = sortedTeams[rank - 1];
          const isRevealed = revealStep >= (5 - rank);
          
          return (
            <div key={rank} className={`transition-all duration-700 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className={`p-6 rounded border flex items-center justify-between shadow-md 
                ${rank === 1 ? 'bg-stone-800 border-stone-400' : 'bg-stone-900/50 border-stone-800'}`}>
                <div className="flex items-center space-x-8">
                  <span className="text-2xl font-bold font-shogi text-stone-500">第{rank}位</span>
                  <div>
                    <div className="text-2xl font-bold font-shogi text-stone-200">{team.name}</div>
                    <div className="text-xs font-medium text-stone-500 mt-1">勝ち点: {team.points} | 個人勝数: {team.individualWins}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {revealStep < 4 && (
        <div className="flex justify-center">
          <button 
            onClick={() => setRevealStep(prev => prev + 1)}
            className="px-12 py-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-bold transition-all"
          >
            順位を表示する
          </button>
        </div>
      )}

      {revealStep >= 4 && (
        <div className="animate-fadeIn space-y-6 pt-12">
          <div className="text-center border-b border-stone-800 pb-2">
            <h3 className="text-xl font-bold font-shogi text-stone-400">個人勝数一覧</h3>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-800/30 text-stone-500 text-xs font-bold uppercase tracking-widest">
                  <th className="p-4">順位</th>
                  <th className="p-4">氏名</th>
                  <th className="p-4 text-right">勝数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {rankedPlayers.map((p, idx) => (
                  <tr key={idx} className="hover:bg-stone-800/10 transition-colors">
                    <td className="p-4 text-stone-500">{p.rank}位</td>
                    <td className="p-4 font-bold text-stone-300">{p.name}</td>
                    <td className="p-4 text-right font-bold text-xl">{p.wins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalStandings;
