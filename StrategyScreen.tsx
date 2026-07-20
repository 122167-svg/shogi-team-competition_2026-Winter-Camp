import React, { useState } from 'react';
import { RoundData, PlayerSlot } from './types';
import { TEAMS, SLOTS, SUBSTITUTE_KEY, hasSubstitute } from './constants';

interface Props {
  round: RoundData;
  onUpdateAssignment: (matchIdx: number, teamId: number, assignments: { [key: string]: string }) => void;
  onComplete: () => void;
}

type SlotOrSub = PlayerSlot | typeof SUBSTITUTE_KEY;

const StrategyScreen: React.FC<Props> = ({ round, onUpdateAssignment, onComplete }) => {
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [tempAssignments, setTempAssignments] = useState<{ [slot: string]: string }>({});
  const [swapModal, setSwapModal] = useState<{ slot: SlotOrSub, playerName: string, prevSlot: string } | null>(null);

  const matchesForRound = round.matches;
  const allTeamIds = matchesForRound.flatMap(m => [m.team1Id, m.team2Id]);

  const slotsAllFilledInTeam = (teamId: number, source: { [key: string]: string }) =>
    SLOTS.every(s => !!source[s]);

  const isTeamDone = (teamId: number) => {
    const match = matchesForRound.find(m => m.team1Id === teamId || m.team2Id === teamId);
    if (!match) return false;
    return slotsAllFilledInTeam(teamId, match.assignments[teamId]) &&
      (!hasSubstitute(teamId) || !!match.assignments[teamId][SUBSTITUTE_KEY]);
  };

  const startRegistration = (teamId: number) => {
    setActiveTeamId(teamId);
    setTempAssignments({});
  };

  const handleSelectPlayer = (slot: SlotOrSub, playerName: string) => {
    if (playerName === "") {
      setTempAssignments(prev => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
      return;
    }
    // 重複チェック（補欠⇄スロットの入替も対応）
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
    const filledSlotPlayers = SLOTS.map(s => tempAssignments[s] || "").filter(Boolean);
    if (new Set(filledSlotPlayers).size !== 4 || filledSlotPlayers.length !== 4) {
      alert("スロットA〜Dは選手4名を重複なく選択してください。");
      return;
    }
    const isSubTeam = hasSubstitute(activeTeamId);
    if (isSubTeam && !tempAssignments[SUBSTITUTE_KEY]) {
      alert(`${TEAMS.find(t => t.id === activeTeamId)?.name} は補欠を1名設定してください。`);
      return;
    }
    // 補欠チームの場合、スロット4名と補欠1名が全て異なる選手か確認
    if (isSubTeam) {
      const allAssigned = new Set([
        ...filledSlotPlayers,
        tempAssignments[SUBSTITUTE_KEY]
      ]);
      if (allAssigned.size !== 5) {
        alert("スロット4名と補欠1名は全員異なる選手にしてください。");
        return;
      }
    }

    const matchIdx = matchesForRound.findIndex(m => m.team1Id === activeTeamId || m.team2Id === activeTeamId);
    onUpdateAssignment(matchIdx, activeTeamId, tempAssignments);
    setActiveTeamId(null);
  };

  const canProceed = allTeamIds.every(id => isTeamDone(id));
  const activeTeam = activeTeamId ? TEAMS.find(t => t.id === activeTeamId) : null;
  const remaining = 4 - SLOTS.filter(s => !!tempAssignments[s]).length;
  const subChosen = !!tempAssignments[SUBSTITUTE_KEY];

  return (
    <div className="space-y-10 animate-fadeIn max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-black font-serif-shogi text-white">オーダー登録 (4 vs 4)</h2>
        <div className="accent-line mt-4 mb-2"></div>
        <p className="text-stone-400 font-bold text-sm tracking-widest uppercase">Secret Order Submission</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allTeamIds.map(id => {
          const team = TEAMS.find(t => t.id === id);
          const done = isTeamDone(id);
          const hasSub = hasSubstitute(id);
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
                  <div className="mt-1 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    登録人数 {team?.players.length}名
                    {hasSub && "（うち補欠1名）"}
                  </div>
                  {hasSub && !done && (
                    <div className="mt-2 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                      ※ 補欠1名設定可（対局毎に変動可）
                    </div>
                  )}
                </div>
                <div className={`w-4 h-4 rounded-full ${done ? 'bg-stone-600' : 'bg-amber-600 animate-pulse'}`}></div>
              </div>
            </button>
          );
        })}
      </div>

      {activeTeam && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121110] w-full max-w-md p-8 rounded-xl border border-stone-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <div className="text-amber-600 font-black text-xs tracking-widest uppercase mb-1">Registration Form</div>
              <h3 className="text-3xl font-black font-serif-shogi text-white">{activeTeam.name}</h3>
              <div className="mt-4 py-1 px-4 bg-stone-900 rounded-full inline-block">
                <span className="text-xs font-bold text-stone-400">
                  {remaining > 0 ? `スロット あと ${remaining} 名選択してください` : '全スロット入力済み'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {SLOTS.map(slot => (
                <div key={slot} className="flex flex-col space-y-2">
                  <label className="text-xs font-black text-stone-500 uppercase tracking-tighter">Slot {slot}</label>
                  <select
                    value={tempAssignments[slot] || ""}
                    onChange={(e) => handleSelectPlayer(slot, e.target.value)}
                    className="bg-stone-900 border-2 border-stone-800 p-3 rounded-lg font-bold text-white focus:border-amber-600 outline-none transition-colors cursor-pointer"
                  >
                    <option value="">-- 選手を選択 --</option>
                    {activeTeam.players.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              ))}

              {hasSubstitute(activeTeam.id) && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-stone-800">
                  <label className="text-xs font-black text-red-400 uppercase tracking-tighter">
                    補欠 (Substitute) ※ 対局毎に変動可
                  </label>
                  <select
                    value={tempAssignments[SUBSTITUTE_KEY] || ""}
                    onChange={(e) => handleSelectPlayer(SUBSTITUTE_KEY, e.target.value)}
                    className="bg-stone-900 border-2 border-red-900/60 p-3 rounded-lg font-bold text-white focus:border-red-500 outline-none transition-colors cursor-pointer"
                  >
                    <option value="">-- 補欠選手を選択 --</option>
                    {activeTeam.players.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    4スロットで出場する4名とは別の1名を補欠として指定します（5名のうち1名が対局毎にベンチ）。
                  </p>
                  {subChosen && (
                    <p className="text-[10px] font-bold text-red-300">
                      補欠: <span className="text-white">{tempAssignments[SUBSTITUTE_KEY]}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <button onClick={() => setActiveTeamId(null)} className="flex-1 py-4 btn-outline rounded-lg font-black">戻る</button>
              <button
                onClick={submitRegistration}
                disabled={remaining > 0 || (hasSubstitute(activeTeam.id) && !subChosen)}
                className="flex-1 py-4 btn-primary rounded-lg shadow-xl disabled:opacity-20"
              >
                確定
              </button>
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
                「<span className="text-white font-bold">{swapModal.playerName}</span>」は既に {swapModal.prevSlot === SUBSTITUTE_KEY ? '補欠' : `Slot ${swapModal.prevSlot}`} で選ばれています。{swapModal.slot === SUBSTITUTE_KEY ? '補欠' : `Slot ${swapModal.slot}`} に入れ替えますか？
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
