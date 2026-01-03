
import React, { useState } from 'react';
import { RoundData } from './types';
import { TEAMS } from './constants';

interface Props {
  round: RoundData;
  onNext: () => void;
}

const RoundReveal: React.FC<Props> = ({ round, onNext }) => {
  const [revealedMatchIdx, setRevealedMatchIdx] = useState<number | null>(null);

  const getTeamScore = (matchIdx: number, teamId: number) => {
    return round.matches[matchIdx].results.filter(r => r.winnerTeamId === teamId).length;
  };

  const getMatchVerdict = (matchIdx: number) => {
    const m = round.matches[matchIdx];
    const s1 = getTeamScore(matchIdx, m.team1Id);
    const s2 = getTeamScore(matchIdx, m.team2Id);
    if (s1 > s2) return { winner: m.team1Id, text: "勝利" };
    if (s2 > s1) return { winner: m.team2Id, text: "勝利" };
    return { winner: null, text: "引き分け" };
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <span className="text-amber-600 text-xs font-black uppercase tracking-[0.4em]">Round Summary</span>
        <h2 className="text-5xl font-black font-serif-shogi text-white">第{round.roundNumber}回戦 結果</h2>
        <div className="accent-line max-w-xs mx-auto"></div>
      </div>

      <div className="space-y-10">
        {round.matches.map((match, mIdx) => {
          const verdict = getMatchVerdict(mIdx);
          const s1 = getTeamScore(mIdx, match.team1Id);
          const s2 = getTeamScore(mIdx, match.team2Id);
          const isRevealed = revealedMatchIdx !== null && revealedMatchIdx >= mIdx;

          return (
            <div key={mIdx} className="card p-12 space-y-10 border-amber-600/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {isRevealed && (
                <div className="absolute top-0 right-0 p-4 font-black italic text-zinc-800 text-8xl -rotate-12 pointer-events-none opacity-20">
                  {verdict.winner ? 'FINISH' : 'DRAW'}
                </div>
              )}

              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1 text-center space-y-4">
                  <div className="text-3xl font-black font-serif-shogi text-white drop-shadow-lg">{TEAMS.find(t => t.id === match.team1Id)?.name}</div>
                  <div className={`text-8xl font-black transition-all duration-1000 ${isRevealed ? 'text-amber-500 scale-100 opacity-100' : 'text-zinc-800 scale-50 opacity-0'}`}>
                    {s1}
                  </div>
                </div>
                
                <div className="px-10">
                  <div className="vs-badge text-2xl scale-150">VS</div>
                </div>

                <div className="flex-1 text-center space-y-4">
                  <div className="text-3xl font-black font-serif-shogi text-white drop-shadow-lg">{TEAMS.find(t => t.id === match.team2Id)?.name}</div>
                  <div className={`text-8xl font-black transition-all duration-1000 ${isRevealed ? 'text-amber-500 scale-100 opacity-100' : 'text-zinc-800 scale-50 opacity-0'}`}>
                    {s2}
                  </div>
                </div>
              </div>

              {isRevealed ? (
                <div className="text-center pt-8 border-t border-zinc-800 animate-fadeIn">
                  <span className={`text-4xl font-black font-serif-shogi px-12 py-3 rounded-full border-2 shadow-2xl
                    ${verdict.winner === null ? 'border-zinc-700 text-zinc-500' : 'border-amber-600 text-white bg-amber-600/10'}`}>
                    {verdict.winner ? `${TEAMS.find(t => t.id === verdict.winner)?.name} の勝利` : '引き分け'}
                  </span>
                </div>
              ) : (
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setRevealedMatchIdx(mIdx)}
                    className="px-12 py-4 btn-primary rounded-full text-xl shadow-xl hover:scale-105 active:scale-95 transition-transform"
                  >
                    この試合の結果を表示
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {revealedMatchIdx !== null && revealedMatchIdx === round.matches.length - 1 && (
        <div className="flex justify-center pt-10">
          <button 
            onClick={onNext}
            className="px-24 py-6 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-2xl transition-all shadow-2xl active:scale-95 border-b-4 border-zinc-400"
          >
            次へ進む
          </button>
        </div>
      )}
    </div>
  );
};

export default RoundReveal;
