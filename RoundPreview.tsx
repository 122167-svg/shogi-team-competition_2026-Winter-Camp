
import React from 'react';
import { RoundData } from './types';
import { TEAMS } from './constants';

interface Props {
  round: RoundData;
  onNext: () => void;
}

const RoundPreview: React.FC<Props> = ({ round, onNext }) => {
  return (
    <div className="text-center space-y-12 animate-fadeIn max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-amber-600 text-xl font-bold tracking-[0.3em] uppercase">Tournament Round</h2>
        <div className="text-9xl font-black font-serif-shogi text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          {round.roundNumber}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {round.matches.map((match, idx) => {
          const t1 = TEAMS.find(t => t.id === match.team1Id);
          const t2 = TEAMS.find(t => t.id === match.team2Id);
          return (
            <div key={idx} className="card p-10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-600"></div>
              <div className="flex items-center justify-between gap-4">
                {/* Team 1 Side */}
                <div className="flex-1 space-y-4">
                  <div className="text-2xl font-black text-white">{t1?.name}</div>
                  <div className="flex flex-col gap-1.5">
                    {t1?.players.map(p => (
                      <div key={p} className="text-[11px] font-bold bg-stone-800 text-stone-300 py-1.5 px-2 rounded border border-stone-700 shadow-inner">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                {/* VS Badge */}
                <div className="shrink-0 z-10">
                  <div className="vs-badge text-xl scale-125">VS</div>
                </div>

                {/* Team 2 Side */}
                <div className="flex-1 space-y-4">
                  <div className="text-2xl font-black text-white">{t2?.name}</div>
                  <div className="flex flex-col gap-1.5">
                    {t2?.players.map(p => (
                      <div key={p} className="text-[11px] font-bold bg-stone-800 text-stone-300 py-1.5 px-2 rounded border border-stone-700 shadow-inner">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6">
        <button 
          onClick={onNext}
          className="px-24 py-6 btn-primary rounded-full text-2xl active:scale-95 shadow-2xl"
        >
          オーダー登録を開始
        </button>
      </div>
    </div>
  );
};

export default RoundPreview;
