
import React from 'react';
import { RoundData } from '../types';
import { SLOTS, TEAMS } from '../constants';
import LayoutMap from './LayoutMap';

interface Props {
  round: RoundData;
  onNext: () => void;
}

const MatchingScreen: React.FC<Props> = ({ round, onNext }) => {
  const m1 = round.matches[0];
  const m2 = round.matches[1];

  const leftPair: [string, string][] = [
    [m1.assignments[m1.team1Id]['A'], m1.assignments[m1.team2Id]['A']],
    [m1.assignments[m1.team1Id]['B'], m1.assignments[m1.team2Id]['B']]
  ];
  const rightPair: [string, string][] = [
    [m2.assignments[m2.team1Id]['A'], m2.assignments[m2.team2Id]['A']],
    [m2.assignments[m2.team1Id]['B'], m2.assignments[m2.team2Id]['B']]
  ];

  return (
    <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold font-serif-shogi text-white">第{round.roundNumber}回戦 対戦表</h2>
        <p className="text-zinc-400 font-medium">配置図に従って速やかに着席してください。</p>
      </div>

      <LayoutMap leftPair={leftPair} rightPair={rightPair} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {round.matches.map((match, mIdx) => (
          <div key={mIdx} className="card overflow-hidden border-zinc-700">
            <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-700 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Match {mIdx + 1}</span>
              <span className="font-bold text-sm text-white">
                {TEAMS.find(t => t.id === match.team1Id)?.name} <span className="text-zinc-500 font-normal px-1 italic">VS</span> {TEAMS.find(t => t.id === match.team2Id)?.name}
              </span>
            </div>
            <div className="p-6 space-y-3">
              {SLOTS.map(slot => (
                <div key={slot} className="flex items-center text-base">
                  <span className="w-10 font-black text-zinc-500 text-xs">{slot}</span>
                  <div className="flex-1 flex justify-between items-center px-4 py-3 bg-zinc-950/50 rounded border border-zinc-800">
                    <span className="font-bold text-white flex-1 text-center">{match.assignments[match.team1Id][slot]}</span>
                    <span className="text-[11px] text-black bg-white font-black px-2 py-0.5 rounded mx-3 shadow-sm">VS</span>
                    <span className="font-bold text-white flex-1 text-center">{match.assignments[match.team2Id][slot]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button 
          onClick={onNext}
          className="w-full max-w-sm py-5 btn-primary rounded text-xl shadow-xl border border-white/20"
        >
          対局を開始する
        </button>
      </div>
    </div>
  );
};

export default MatchingScreen;
