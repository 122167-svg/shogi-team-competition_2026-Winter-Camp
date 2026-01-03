
import React, { useState } from 'react';
import { RoundData } from '../types';
import { TEAMS } from '../constants';

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
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="text-center border-b border-stone-800 pb-6">
        <span className="text-stone-500 text-xs font-bold tracking-widest uppercase">Round Result</span>
        <h2 className="text-3xl font-bold font-shogi text-stone-200 mt-1">第{round.roundNumber}回戦 結果報告</h2>
      </div>

      <div className="space-y-6">
        {round.matches.map((match, mIdx) => {
          const verdict = getMatchVerdict(mIdx);
          const s1 = getTeamScore(mIdx, match.team1Id);
          const s2 = getTeamScore(mIdx, match.team2Id);
          const isRevealed = revealedMatchIdx !== null && revealedMatchIdx >= mIdx;

          return (
            <div key={mIdx} className="bg-stone-900 border border-stone-800 rounded p-8 space-y-6">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold font-shogi text-stone-400 mb-2">{TEAMS.find(t => t.id === match.team1Id)?.name}</div>
                  <div className={`text-5xl font-bold ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>{s1}</div>
                </div>
                <div className="text-xl font-bold text-stone-700 px-8">—</div>
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold font-shogi text-stone-400 mb-2">{TEAMS.find(t => t.id === match.team2Id)?.name}</div>
                  <div className={`text-5xl font-bold ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>{s2}</div>
                </div>
              </div>

              {isRevealed && (
                <div className="text-center pt-4 border-t border-stone-800/50">
                  <span className={`text-2xl font-bold font-shogi px-6 py-2 rounded border 
                    ${verdict.winner === null ? 'border-stone-700 text-stone-500' : 'border-stone-400 text-stone-200 bg-stone-800'}`}>
                    {verdict.winner ? `${TEAMS.find(t => t.id === verdict.winner)?.name} ${verdict.text}` : verdict.text}
                  </span>
                </div>
              )}

              {!isRevealed && (
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setRevealedMatchIdx(mIdx)}
                    className="px-8 py-2 bg-stone-800 hover:bg-stone-700 text-sm rounded font-medium text-stone-400 transition-all"
                  >
                    対戦結果を表示
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {revealedMatchIdx !== null && revealedMatchIdx === round.matches.length - 1 && (
        <div className="flex justify-center pt-8">
          <button 
            onClick={onNext}
            className="px-16 py-4 bg-stone-200 text-stone-900 hover:bg-white rounded font-bold text-lg transition-all active:scale-95"
          >
            次へ進む
          </button>
        </div>
      )}
    </div>
  );
};

export default RoundReveal;
