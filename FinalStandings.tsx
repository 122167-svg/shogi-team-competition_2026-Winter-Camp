import React, { useState } from 'react';
import { RoundData } from './types';
import { TEAMS } from './constants';

interface Props {
  allRounds: RoundData[];
}

const FinalStandings: React.FC<Props> = ({ allRounds }) => {
  const [revealStep, setRevealStep] = useState(0);

  // 4 vs 4 勝敗ルール（前大会方式）:
  //   自チームの勝ち数 (myWins) が
  //     3勝以上 → 勝ち点 2
  //     2勝    → 勝ち点 1
  //     1勝以下 → 勝ち点 0
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

  // 個人勝数（チーム②の補欠も対戦すればカウントされる想定：今回はベンチのためカウントされない）
  const playerStatsMap: { [name: string]: number } = {};
  TEAMS.forEach(t => t.players.forEach(p => playerStatsMap[p] = 0));

  allRounds.forEach(round => {
    round.matches.forEach(match => {
      match.results.forEach(res => {
        if (res.winnerTeamId && res.winnerTeamId > 0) {
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

  const totalTeams = sortedTeams.length;

  return (
    <div className="space-y-16 animate-fadeIn pb-40 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <span className="text-amber-600 text-xs font-black uppercase tracking-[0.5em]">Final Results Reveal</span>
        <h2 className="text-6xl font-black font-serif-shogi text-white">栄光の表彰式</h2>
        <div className="accent-line max-w-sm mx-auto"></div>
        <p className="text-stone-500 text-xs">勝ち点: 3勝以上=2点 / 2勝=1点 / 1勝以下=0点</p>
      </div>

      <div className="space-y-6">
        {Array.from({ length: totalTeams }, (_, i) => totalTeams - i).map(rank => {
          const team = sortedTeams[rank - 1];
          const isRevealed = revealStep >= (totalTeams + 1 - rank);
          const isFirst = rank === 1;

          return (
            <div key={rank} className={`transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className={`p-8 rounded-xl border-2 flex items-center justify-between shadow-2xl overflow-hidden relative
                ${isFirst ? 'bg-amber-600/10 border-amber-500' : 'bg-zinc-900/80 border-zinc-800'}`}>

                {isFirst && isRevealed && (
                  <div className="absolute top-0 right-0 p-2 font-black italic text-amber-500/10 text-9xl -mr-8 -mt-8 pointer-events-none">NO.1</div>
                )}

                <div className="flex items-center space-x-10 relative z-10">
                  <div className={`text-3xl font-black font-serif-shogi ${isFirst ? 'text-amber-500' : 'text-zinc-500'}`}>
                    第{rank}位
                  </div>
                  <div>
                    <div className="text-4xl font-black font-serif-shogi text-white tracking-wider">{team.name}</div>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">勝ち点: <span className="text-white text-lg ml-1">{team.points}</span></span>
                      <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">個人勝数: <span className="text-white text-lg ml-1">{team.individualWins}</span></span>
                    </div>
                  </div>
                </div>

                {isRevealed && (
                  <div className={`text-5xl font-black ${isFirst ? 'text-amber-500' : 'text-zinc-700'}`}>
                    {isFirst ? '🏆' : `${rank}`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {revealStep < totalTeams && (
        <div className="flex justify-center">
          <button
            onClick={() => setRevealStep(prev => prev + 1)}
            className="px-20 py-5 btn-primary rounded-full text-xl shadow-[0_15px_30px_rgba(217,119,6,0.3)]"
          >
            {revealStep === 0 ? '結果発表を開始する' : '次の順位を表示'}
          </button>
        </div>
      )}

      {revealStep >= totalTeams && (
        <div className="animate-fadeIn space-y-8 pt-16">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black font-serif-shogi text-amber-500">個人成績 (勝数ランキング)</h3>
            <div className="h-0.5 w-40 bg-zinc-800 mx-auto"></div>
          </div>
          <div className="card border-zinc-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-800 text-stone-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  <th className="p-6">RANK</th>
                  <th className="p-6">NAME</th>
                  <th className="p-6 text-right">TOTAL WINS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rankedPlayers.map((p, idx) => (
                  <tr key={idx} className={`hover:bg-amber-600/5 transition-colors ${p.rank === 1 ? 'bg-amber-600/5' : ''}`}>
                    <td className="p-6">
                      <span className={`font-black text-sm px-3 py-1 rounded ${p.rank === 1 ? 'bg-amber-600 text-black' : 'text-stone-500 border border-zinc-800'}`}>
                        {p.rank}位
                      </span>
                    </td>
                    <td className={`p-6 text-xl font-black ${p.rank === 1 ? 'text-white' : 'text-stone-300'}`}>{p.name}</td>
                    <td className="p-6 text-right font-black text-3xl text-amber-500">{p.wins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-20 pb-10">
            <button onClick={() => window.location.reload()} className="text-zinc-600 font-bold hover:text-white transition-colors underline underline-offset-8">
              大会をリセットしてトップに戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalStandings;
