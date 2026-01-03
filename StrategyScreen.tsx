
import React, { useState } from 'react';
import { RoundData, PlayerSlot } from '../types';
import { TEAMS, SLOTS } from '../constants';

interface Props {
  round: RoundData;
  announcement: string;
  onUpdateAssignment: (matchIdx: number, teamId: number, assignments: { [key: string]: string }) => void;
  onComplete: () => void;
}

const StrategyScreen: React.FC<Props> = ({ round, announcement, onUpdateAssignment, onComplete }) => {
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [tempAssignments, setTempAssignments] = useState<{ [slot: string]: string }>({});
  const [swapModal, setSwapModal] = useState<{ slot: PlayerSlot, playerName: string, prevSlot: string } | null>(null);

  const matchesForRound = round.matches;
  const allTeamIds = matchesForRound.flatMap(m => [m.team1Id, m.team2Id]);

  const isTeamDone = (teamId: number) => {
    const match = matchesForRound.find(m => m.team1Id === teamId || m.team2Id === teamId);
    return match && Object.keys(match.assignments[teamId]).length === 4;
  };

  const startRegistration = (teamId: number) => {
    setActiveTeamId(teamId);
    setTempAssignments({});
  };

  const handleSelectPlayer = (slot: PlayerSlot, playerName: string) => {
    if (playerName === "") {
      setTempAssignments(prev => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
      return;
    }

    const prevSlotEntry = Object.entries(tempAssignments).find(
      ([s, name]) => s !== slot && name === playerName
    );

    if (prevSlotEntry) {
      setSwapModal({ slot, playerName, prevSlot: prevSlotEntry[0] });
      return;
    }

    setTempAssignments(prev => ({ ...prev, [slot]: playerName }));
  };

  const executeSwap = () => {
    if (!swapModal) return;
    setTempAssignments(prev => {
      const next = { ...prev };
      delete next[swapModal.prevSlot];
      next[swapModal.slot] = swapModal.playerName;
      return next;
    });
    setSwapModal(null);
  };

  const submitRegistration = () => {
    if (activeTeamId === null) return;
    // 最終的なユニーク制約の二重チェック
    const players = Object.values(tempAssignments);
    if (new Set(players).size !== 4 || players.length !== 4) {
      alert("エラー：4名全員を重複なく選択してください。");
      return;
    }
    const matchIdx = matchesForRound.findIndex(m => m.team1Id === activeTeamId || m.team2Id === activeTeamId);
    onUpdateAssignment(matchIdx, activeTeamId, tempAssignments);
    setActiveTeamId(null);
  };

  const canProceed = allTeamIds.every(id => isTeamDone(id));
  const activeTeam = activeTeamId ? TEAMS.find(t => t.id === activeTeamId) : null;
  const remainingCount = 4 - Object.keys(tempAssignments).length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
      {announcement && (
        <div className="bg-zinc-900 border-l-4 border-white p-6 rounded shadow-sm">
          <p className="text-zinc-100 font-medium leading-relaxed italic">
            「{announcement}」
          </p>
        </div>
      )}

      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold font-serif-shogi">オーダー提出</h2>
        <p className="text-sm text-zinc-400 mt-1 font-medium">各チームは出場スロットに選手を割り当ててください。</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTeamIds.map(id => {
          const team = TEAMS.find(t => t.id === id);
          const done = isTeamDone(id);
          return (
            <button
              key={id}
              onClick={() => !done && startRegistration(id)}
              disabled={done}
              className={`p-8 card text-left transition-all group
                ${done 
                  ? 'opacity-40 cursor-default grayscale' 
                  : 'hover:border-zinc-400 border-zinc-700 bg-zinc-900'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Team Name</div>
                  <div className="text-xl font-bold text-white">{team?.name}</div>
                </div>
                <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                  ${done ? 'bg-zinc-800 text-zinc-400' : 'bg-white text-black'}`}>
                  {done ? '登録完了' : '未提出'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {activeTeam && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="bg-[#121212] w-full max-w-md p-8 rounded border border-zinc-700 shadow-2xl space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold font-serif-shogi text-white">{activeTeam.name}</h3>
              <p className="text-zinc-400 text-xs mt-2 font-bold uppercase tracking-widest">オーダー入力</p>
            </div>

            <div className="space-y-4">
              {SLOTS.map(slot => (
                <div key={slot} className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Slot {slot}</label>
                  <select
                    value={tempAssignments[slot] || ""}
                    onChange={(e) => handleSelectPlayer(slot, e.target.value)}
                    className="bg-zinc-900 border border-zinc-600 p-3 rounded font-bold text-white focus:border-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="">未選択</option>
                    {activeTeam.players.map(p => (
                      <option key={p} value={p} className="bg-zinc-900">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              {remainingCount > 0 ? (
                <p className="text-zinc-400 text-xs font-bold">残り {remainingCount} 名の登録が必要です</p>
              ) : (
                <p className="text-green-400 text-xs font-bold">全員選択されました</p>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <button 
                onClick={() => setActiveTeamId(null)}
                className="flex-1 py-4 btn-outline rounded font-bold text-sm"
              >
                キャンセル
              </button>
              <button 
                onClick={submitRegistration}
                disabled={Object.keys(tempAssignments).length < 4}
                className="flex-1 py-4 btn-primary rounded text-sm disabled:opacity-20 shadow-lg"
              >
                登録確定
              </button>
            </div>
          </div>
        </div>
      )}

      {swapModal && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-zinc-900 p-8 rounded border border-zinc-600 max-w-sm w-full space-y-6 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl">🔄</span>
              </div>
              <p className="font-bold leading-relaxed text-zinc-100">
                <span className="text-white underline">{swapModal.playerName}</span> は既に <span className="text-white">スロット {swapModal.prevSlot}</span> で選択されています。<br/>
                スロット {swapModal.slot} と入れ替えますか？
              </p>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setSwapModal(null)} className="flex-1 py-3 btn-outline rounded text-sm font-bold">戻る</button>
              <button onClick={executeSwap} className="flex-1 py-3 bg-white text-black hover:bg-zinc-200 rounded text-sm font-bold transition-colors">入れ替える</button>
            </div>
          </div>
        </div>
      )}

      {canProceed && (
        <div className="flex justify-center pt-10">
          <button 
            onClick={onComplete}
            className="w-full py-5 btn-primary rounded text-lg shadow-2xl border border-white/20"
          >
            対戦カードを確定する
          </button>
        </div>
      )}
    </div>
  );
};

export default StrategyScreen;
