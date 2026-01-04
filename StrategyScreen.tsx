
import React, { useState } from 'react';
import { RoundData, PlayerSlot } from './types';
import { TEAMS, SLOTS } from './constants';

interface Props {
  round: RoundData;
  onUpdateAssignment: (matchIdx: number, teamId: number, assignments: { [key: string]: string }) => void;
  onComplete: () => void;
}

const StrategyScreen: React.FC<Props> = ({ round, onUpdateAssignment, onComplete }) => {
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
      setSwapModal({ slot, playerName, prevSlot: prevSlotEntry[0] as PlayerSlot });
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
    const players = Object.values(tempAssignments);
    if (new Set(players).size !== 4 || players.length !== 4) {
      alert("4名全員を重複なく選択してください。");
      return;
    }
    const matchIdx = matchesForRound.findIndex(m => m.team1Id === activeTeamId || m.team2Id === activeTeamId);
    onUpdateAssignment(matchIdx, activeTeamId, tempAssignments);
    setActiveTeamId(null);
  };

  const canProceed = allTeamIds.every(id => isTeamDone(id));
  const activeTeam = activeTeamId ? TEAMS.find(t => t.id === activeTeamId) : null;
  const remaining = 4 - Object.keys(tempAssignments).length;

  return (
    <div className="space-y-10 animate-fadeIn max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-black font-serif-shogi text-white"オーダー登録</h2>
        <div className="accent-line mt-4 mb-2"></div>
        <p className="text-stone-400 font-bold text-sm tracking-widest uppercase">Secret Order Submission</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allTeamIds.map(id => {
          const team = TEAMS.find(t => t.id === id);
          const done = isTeamDone(id);
          return (
            <button
              key={id}
              onClick={() => !done && startRegistration(id)}
              disabled={done}
              className={`p-8 card text-left transition-all border-2 relative group
                ${done 
                  ? 'opacity-40 border-transparent grayscale cursor-default' 
                  : 'hover:border-amber-600 border-stone-800'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-amber-600 text-[10px] font-black uppercase tracking-widest mb-1">TEAM NAME</div>
                  <div className="text-2xl font-black text-white">{team?.name}</div>
                </div>
                <div className={`w-4 h-4 rounded-full ${done ? 'bg-stone-600' : 'bg-amber-600 animate-pulse'}`}></div>
              </div>
            </button>
          );
        })}
      </div>

      {activeTeam && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121110] w-full max-w-md p-10 rounded-xl border border-stone-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-amber-600 font-black text-xs tracking-widest uppercase mb-1">Registration Form</div>
              <h3 className="text-3xl font-black font-serif-shogi text-white">{activeTeam.name}</h3>
              <div className="mt-4 py-1 px-4 bg-stone-900 rounded-full inline-block">
                <span className="text-xs font-bold text-stone-400">
                  {remaining > 0 ? `あと ${remaining} 名選択してください` : '全スロット入力済み'}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              {SLOTS.map(slot => (
                <div key={slot} className="flex flex-col space-y-2">
                  <label className="text-xs font-black text-stone-500 uppercase tracking-tighter">Slot {slot}</label>
                  <select
                    value={tempAssignments[slot] || ""}
                    onChange={(e) => handleSelectPlayer(slot, e.target.value)}
                    className="bg-stone-900 border-2 border-stone-800 p-4 rounded-lg font-bold text-white focus:border-amber-600 outline-none transition-colors cursor-pointer"
                  >
                    <option value="">-- 選手を選択 --</option>
                    {activeTeam.players.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 pt-4">
              <button onClick={() => setActiveTeamId(null)} className="flex-1 py-4 btn-outline rounded-lg font-black">戻る</button>
              <button onClick={submitRegistration} disabled={remaining > 0} className="flex-1 py-4 btn-primary rounded-lg shadow-xl disabled:opacity-20">確定</button>
            </div>
          </div>
        </div>
      )}

      {swapModal && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-stone-900 p-8 rounded-xl border border-stone-700 max-w-sm w-full space-y-8 shadow-2xl text-center">
            <div className="space-y-3">
              <p className="text-xl font-black text-white leading-tight">選手が重複しています</p>
              <p className="text-stone-400 font-medium">
                「<span className="text-white font-bold">{swapModal.playerName}</span>」は既に Slot {swapModal.prevSlot} で選ばれています。Slot {swapModal.slot} に入れ替えますか？
              </p>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setSwapModal(null)} className="flex-1 py-4 btn-outline rounded-lg">キャンセル</button>
              <button onClick={executeSwap} className="flex-1 py-4 btn-primary rounded-lg">入れ替える</button>
            </div>
          </div>
        </div>
      )}

      {canProceed && (
        <div className="flex justify-center pt-10">
          <button onClick={onComplete} className="w-full py-6 btn-primary rounded-xl text-2xl shadow-[0_20px_40px_rgba(217,119,6,0.3)] border-b-4 border-amber-800">
            全チーム登録完了：次へ進む
          </button>
        </div>
      )}
    </div>
  );
};

export default StrategyScreen;
