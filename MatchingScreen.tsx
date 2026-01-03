
import React from 'react';
import { RoundData } from './types';
import { SLOTS, TEAMS } from './constants';
import LayoutMap from './LayoutMap';

interface Props {
  round: RoundData;
  onNext: () => void;
}

const MatchingScreen: React.FC<Props> = ({ round, onNext }) => {
  const m1 = round.matches[0];
  const m2 = round.matches[1];

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block bg-amber-600/10 text-amber-500 px-6 py-1 rounded-full text-xs font-black tracking-widest uppercase border border-amber-600/20">
          Round Pairing & Placement
        </div>
        <h2 className="text-5xl font-black font-serif-shogi text-white">第{round.roundNumber}回戦：対局配置</h2>
        <div className="accent-line max-w-md mx-auto"></div>
      </div>

      <LayoutMap 
        match1={{ team1Id: m1.team1Id, team2Id: m1.team2Id, assignments: m1.assignments }}
        match2={{ team1Id: m2.team1Id, team2Id: m2.team2Id, assignments: m2.assignments }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {round.matches.map((match, mIdx) => (
          <div key={mIdx} className="card overflow-hidden shadow-2xl group">
            <div className="bg-stone-800 p-5 flex justify-between items-center border-b border-stone-700">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">MATCH {mIdx + 1}</span>
                <span className="text-xl font-black text-white">
                  {TEAMS.find(t => t.id === match.team1Id)?.name} <span className="text-stone-500 font-serif italic mx-1 text-sm">vs</span> {TEAMS.find(t => t.id === match.team2Id)?.name}
                </span>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {SLOTS.map(slot => (
                <div key={slot} className="flex items-center group/row">
                  <div className="w-8 h-8 flex items-center justify-center bg-stone-900 rounded font-black text-amber-500 text-xs border border-stone-800">
                    {slot}
                  </div>
                  <div className="flex-1 flex justify-between items-center px-6 py-4 bg-stone-950/80 rounded-lg border border-stone-800 ml-4 shadow-inner">
                    <span className="font-black text-white flex-1 text-center truncate">{match.assignments[match.team1Id][slot]}</span>
                    <div className="vs-badge text-[10px] mx-4 shrink-0">VS</div>
                    <span className="font-black text-white flex-1 text-center truncate">{match.assignments[match.team2Id][slot]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button 
          onClick={onNext}
          className="w-full max-w-md py-6 btn-primary rounded-full text-2xl shadow-2xl active:scale-95"
        >
          全員着席を確認：対局開始
        </button>
      </div>
    </div>
  );
};

export default MatchingScreen;
