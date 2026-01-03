
import React from 'react';
import { RoundData } from '../types';
import { TEAMS } from '../constants';

interface Props {
  round: RoundData;
  onNext: () => void;
}

const RoundPreview: React.FC<Props> = ({ round, onNext }) => {
  return (
    <div className="text-center space-y-12 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <h2 className="text-zinc-500 text-xl font-bold tracking-widest uppercase mb-2">Round</h2>
        <div className="text-8xl font-black font-serif-shogi text-white leading-none">{round.roundNumber}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {round.matches.map((match, idx) => {
          const t1 = TEAMS.find(t => t.id === match.team1Id);
          const t2 = TEAMS.find(t => t.id === match.team2Id);
          return (
            <div key={idx} className="bg-zinc-900 p-8 rounded border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-white mb-2">{t1?.name}</div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {t1?.players.map(p => (
                      <span key={p} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="text-zinc-400 font-black px-6 text-xl italic">VS</div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-white mb-2">{t2?.name}</div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {t2?.players.map(p => (
                      <span key={p} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={onNext}
        className="w-full md:w-auto px-20 py-5 btn-primary rounded font-black text-xl transition-all active:scale-95"
      >
        オーダー提出へ
      </button>
    </div>
  );
};

export default RoundPreview;
