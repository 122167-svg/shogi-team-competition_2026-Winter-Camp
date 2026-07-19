import React from 'react';

interface MatchLite {
  team1Id: number;
  team2Id: number;
  assignments: any;
}

interface Props {
  matches: MatchLite[];
}

const LayoutMap: React.FC<Props> = ({ matches }) => {
  const SLOTS: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  const Seat = ({ name, isTop }: { name: string; isTop: boolean }) => (
    <div className="flex flex-col items-center">
      {!isTop && <div className="w-12 h-0.5 bg-stone-700 mb-2"></div>}
      <div className="w-20 md:w-24 h-12 flex items-center justify-center bg-stone-900 border border-stone-700 rounded shadow-lg px-1">
        <span className="text-[10px] md:text-xs font-black text-white truncate text-center">
          {name || '---'}
        </span>
      </div>
      {isTop && <div className="w-12 h-0.5 bg-stone-700 mt-2"></div>}
    </div>
  );

  const BoardGroup = ({ match, slots, colorClass }: {
    match: MatchLite;
    slots: ('A' | 'B' | 'C' | 'D')[];
    colorClass: string;
  }) => (
    <div className="flex space-x-2 md:space-x-3">
      {slots.map(slot => (
        <div key={slot} className="flex flex-col items-center space-y-4">
          <Seat name={match.assignments[match.team1Id]?.[slot]} isTop={true} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border border-stone-800 bg-stone-900 text-[10px] font-black italic ${colorClass}`}>
            {slot}
          </div>
          <Seat name={match.assignments[match.team2Id]?.[slot]} isTop={false} />
        </div>
      ))}
    </div>
  );

  const colors = [
    { label: 'Match 1 Area', color: 'amber' },
    { label: 'Match 2 Area', color: 'red' }
  ];

  return (
    <div className="card p-6 md:p-10 space-y-10 animate-fadeIn border-amber-600/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black">MAP</div>
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <h3 className="text-2xl font-black font-serif-shogi text-amber-500">会場座席配置図</h3>
        <span className="text-[10px] text-stone-500 font-bold tracking-widest uppercase">4 vs 4 (16 Players)</span>
      </div>

      <div className="flex justify-center items-center space-x-4 md:space-x-8 overflow-x-auto pb-4">
        {matches.map((match, idx) => {
          const accent = colors[idx] || colors[0];
          const accentText = accent.color === 'amber' ? 'text-amber-500' : 'text-red-500';
          const accentBadge = accent.color === 'amber'
            ? 'text-amber-600 bg-amber-600/10 border-amber-600/20'
            : 'text-red-600 bg-red-600/10 border-red-600/20';
          return (
            <React.Fragment key={idx}>
              <div className="space-y-4">
                <div className="text-center">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${accentBadge}`}>
                    {accent.label}
                  </span>
                </div>
                <BoardGroup match={match} slots={SLOTS} colorClass={accentText} />
              </div>
              {idx < matches.length - 1 && (
                <div className="flex flex-col items-center space-y-2 py-8">
                  <div className="w-px flex-1 bg-stone-800"></div>
                  <div className="text-[8px] font-black text-stone-700 rotate-90 uppercase tracking-widest py-4">Aisle</div>
                  <div className="w-px flex-1 bg-stone-800"></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 text-center">
        <p className="text-xs font-bold text-stone-400">
          ※ 各自、ボードを挟んで対戦相手と向き合って着席してください。
        </p>
      </div>
    </div>
  );
};

export default LayoutMap;
