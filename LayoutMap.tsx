
import React from 'react';

interface Props {
  leftPair: [string, string][]; // [Team1, Team2] x 2 pairs (Slots A/B and C/D)
  rightPair: [string, string][]; // [Team3, Team4] x 2 pairs
}

const LayoutMap: React.FC<Props> = ({ leftPair, rightPair }) => {
  const PlayerBox = ({ name, teamType }: { name: string, teamType: 'left' | 'right' }) => (
    <div className={`flex-1 p-3 text-center border ${teamType === 'left' ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-700 bg-zinc-800/50'} rounded`}>
      <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Player</div>
      <div className="text-sm font-bold truncate">{name || '---'}</div>
    </div>
  );

  const BoardLine = () => (
    <div className="h-1.5 w-full bg-zinc-700 my-1 rounded-full opacity-50"></div>
  );

  const MatchUnit = ({ players1, players2 }: { players1: string[], players2: string[] }) => (
    <div className="flex flex-col space-y-2 w-full max-w-[200px]">
      <div className="flex space-x-2">
        <PlayerBox name={players1[0]} teamType="left" />
        <PlayerBox name={players2[0]} teamType="right" />
      </div>
      <BoardLine />
      <div className="flex space-x-2">
        <PlayerBox name={players1[1]} teamType="left" />
        <PlayerBox name={players2[1]} teamType="right" />
      </div>
    </div>
  );

  return (
    <div className="card p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h3 className="text-lg font-bold font-serif-shogi">会場座席配置図</h3>
        <span className="text-xs text-zinc-500 font-medium">右上から順に着席してください</span>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 py-4">
        {/* Left Side Matches */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xs font-bold text-zinc-500">エリア A (Match 1)</div>
          <MatchUnit 
            players1={[leftPair[0][0], leftPair[1][0]]} 
            players2={[leftPair[0][1], leftPair[1][1]]} 
          />
        </div>

        {/* Center Divider */}
        <div className="hidden md:block w-px h-32 bg-zinc-800"></div>

        {/* Right Side Matches */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xs font-bold text-zinc-500">エリア B (Match 2)</div>
          <MatchUnit 
            players1={[rightPair[0][0], rightPair[1][0]]} 
            players2={[rightPair[0][1], rightPair[1][1]]} 
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutMap;
