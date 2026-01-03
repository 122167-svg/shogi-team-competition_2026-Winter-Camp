
import React, { useState } from 'react';
import { RoundData, PlayerSlot } from '../types';
import { PASSWORD_REPORT, SLOTS, TEAMS } from '../constants';

interface Props {
  round: RoundData;
  onReport: (matchIdx: number, slot: PlayerSlot, winnerTeamId: number) => void;
  onAllFinished: () => void;
}

const BattleScreen: React.FC<Props> = ({ round, onReport, onAllFinished }) => {
  const [reportModal, setReportModal] = useState<{ mIdx: number, slot: PlayerSlot } | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleReport = (winnerTeamId: number) => {
    if (password !== PASSWORD_REPORT) {
      setError("パスワードが一致しません");
      return;
    }
    if (reportModal) {
      onReport(reportModal.mIdx, reportModal.slot, winnerTeamId);
      setReportModal(null);
      setPassword("");
      setError("");
    }
  };

  const isAllDone = round.matches.every(m => m.completed);

  return (
    <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-serif-shogi text-white">対局進行中</h2>
        <p className="text-zinc-400 font-medium mt-2">対局が終了したスロットから結果を報告してください。</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {round.matches.map((match, mIdx) => (
          <div key={mIdx} className="card shadow-xl overflow-hidden border-zinc-700">
            <div className="bg-zinc-800/30 px-6 py-4 border-b border-zinc-700 flex justify-between items-center">
              <span className="text-lg font-bold font-serif-shogi text-white">
                {TEAMS.find(t => t.id === match.team1Id)?.name} <span className="text-zinc-400 font-sans mx-2 text-sm italic">vs</span> {TEAMS.find(t => t.id === match.team2Id)?.name}
              </span>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${match.completed ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                {match.completed ? '対局終了' : '進行中'}
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {SLOTS.map(slot => {
                const res = match.results.find(r => r.slot === slot);
                const isReported = res?.winnerTeamId !== null;
                const p1 = match.assignments[match.team1Id][slot];
                const p2 = match.assignments[match.team2Id][slot];
                const winnerName = res?.winnerTeamId === match.team1Id ? p1 : p2;

                return (
                  <div key={slot} className={`p-5 rounded border transition-all flex items-center justify-between ${isReported ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-900 border-zinc-600 shadow-lg shadow-white/5'}`}>
                    <div className="flex items-center space-x-5">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-black text-xs border ${isReported ? 'border-zinc-800 text-zinc-700' : 'border-zinc-400 text-white'}`}>
                        {slot}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isReported ? 'text-zinc-600 line-through' : 'text-zinc-100'}`}>
                          {p1} <span className="text-black bg-white px-1 font-black text-[9px] mx-1 rounded">VS</span> {p2}
                        </span>
                        {isReported && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[10px] font-bold text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 uppercase tracking-wider">勝者: {winnerName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isReported && (
                      <button 
                        onClick={() => setReportModal({ mIdx, slot })}
                        className="px-6 py-2 btn-primary rounded text-xs hover:scale-105 active:scale-95 transition-transform"
                      >
                        報告
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {reportModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="bg-[#121212] w-full max-w-sm p-8 rounded border border-zinc-700 shadow-2xl space-y-8">
            <div className="text-center border-b border-zinc-800 pb-4">
              <h3 className="text-xl font-bold font-serif-shogi text-white">結果報告 (Slot {reportModal.slot})</h3>
              <p className="text-zinc-400 text-xs mt-1 font-bold">勝利した選手を選択してください。</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                {id: round.matches[reportModal.mIdx].team1Id, player: round.matches[reportModal.mIdx].assignments[round.matches[reportModal.mIdx].team1Id][reportModal.slot]},
                {id: round.matches[reportModal.mIdx].team2Id, player: round.matches[reportModal.mIdx].assignments[round.matches[reportModal.mIdx].team2Id][reportModal.slot]}
              ].map(info => (
                <button
                  key={info.id}
                  onClick={() => handleReport(info.id)}
                  className="p-5 btn-outline rounded font-bold text-base border-zinc-600 hover:border-white transition-colors flex justify-between items-center"
                >
                  <span className="text-zinc-400 text-xs">{TEAMS.find(t => t.id === info.id)?.name}</span>
                  <span className="text-white">{info.player}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">管理者パスワード</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="****"
                className="w-full bg-zinc-900 border border-zinc-600 p-4 rounded text-center text-3xl font-black outline-none focus:border-white text-white tracking-[0.5em]"
              />
              {error && <p className="text-red-400 text-[10px] font-bold text-center mt-2">{error}</p>}
            </div>

            <button 
              onClick={() => setReportModal(null)}
              className="w-full py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {isAllDone && (
        <div className="flex justify-center pt-10">
          <button 
            onClick={onAllFinished}
            className="w-full max-w-sm py-5 btn-primary rounded text-xl shadow-2xl border border-white/20"
          >
            ラウンド結果を集計する
          </button>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
