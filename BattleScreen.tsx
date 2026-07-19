import React, { useState } from 'react';
import { RoundData, PlayerSlot } from './types';
import { PASSWORD_REPORT, SLOTS, TEAMS } from './constants';

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
      setError("パスワードが正しくありません");
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
    <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto pb-24">
      <div className="text-center">
        <h2 className="text-4xl font-black font-serif-shogi text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          対局進行・勝敗報告
        </h2>
        <div className="accent-line max-w-xs mx-auto mt-4 mb-2"></div>
        <p className="text-stone-400 font-bold text-sm tracking-widest">Active Game Tracking (4 vs 4)</p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {round.matches.map((match, mIdx) => (
          <div key={mIdx} className="card overflow-hidden shadow-2xl border-stone-800">
            <div className="bg-stone-800/80 px-8 py-5 flex justify-between items-center border-b border-stone-700">
              <span className="text-xl font-black font-serif-shogi text-white">
                {TEAMS.find(t => t.id === match.team1Id)?.name}
                <span className="text-amber-600 font-sans mx-3 text-sm italic">vs</span>
                {TEAMS.find(t => t.id === match.team2Id)?.name}
              </span>
              <div className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner ${match.completed ? 'bg-amber-600 text-black' : 'bg-stone-900 text-stone-500 border border-stone-800'}`}>
                {match.completed ? '集計済み' : '進行中'}
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {SLOTS.map(slot => {
                const res = match.results.find(r => r.slot === slot);
                const isReported = res?.winnerTeamId !== null;
                const p1 = match.assignments[match.team1Id][slot];
                const p2 = match.assignments[match.team2Id][slot];
                const winnerName = res?.winnerTeamId === match.team1Id ? p1 : p2;

                return (
                  <div key={slot} className={`p-5 rounded-lg border-2 transition-all flex items-center justify-between shadow-lg ${isReported ? 'bg-stone-900/30 border-stone-800' : 'bg-stone-900 border-stone-700 hover:border-amber-600'}`}>
                    <div className="flex items-center space-x-_format min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm border-2 shrink-0 ${isReported ? 'border-stone-800 text-stone-600' : 'border-stone-600 text-stone-200'}`}>
                        {slot}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className={`text-sm font-black truncate ${isReported ? 'text-stone-600' : 'text-white'}`}>
                          {p1} <span className="vs-badge text-[9px] mx-1">VS</span> {p2}
                        </span>
                        {isReported && (
                          <span className="text-[10px] font-black text-amber-500 mt-1 uppercase tracking-widest">
                            勝者: {winnerName}
                          </span>
                        )}
                      </div>
                    </div>

                    {!isReported && (
                      <button
                        onClick={() => setReportModal({ mIdx, slot })}
                        className="px-5 py-2 btn-primary rounded text-xs hover:scale-105 active:scale-95 transition-transform shrink-0"
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
          <div className="bg-[#121110] w-full max-w-sm p-8 rounded-xl border border-stone-700 shadow-2xl space-y-6">
            <div className="text-center border-b border-stone-800 pb-4">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-widest">Slot {reportModal.slot} - Result Report</span>
              <h3 className="text-2xl font-black font-serif-shogi text-white mt-1">勝者を選択</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { id: round.matches[reportModal.mIdx].team1Id, player: round.matches[reportModal.mIdx].assignments[round.matches[reportModal.mIdx].team1Id][reportModal.slot] },
                { id: round.matches[reportModal.mIdx].team2Id, player: round.matches[reportModal.mIdx].assignments[round.matches[reportModal.mIdx].team2Id][reportModal.slot] }
              ].map(info => (
                <button
                  key={info.id}
                  onClick={() => handleReport(info.id)}
                  className="p-5 btn-outline rounded-lg font-bold text-base border-stone-600 hover:border-amber-600 transition-colors flex justify-between items-center text-left"
                >
                  <span className="text-stone-400 text-xs uppercase tracking-widest">{TEAMS.find(t => t.id === info.id)?.name}</span>
                  <span className="text-white">{info.player}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest text-center block">報告パスワードを入力</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-stone-900 border-2 border-stone-800 p-4 rounded-lg text-center text-2xl font-black outline-none focus:border-amber-600 text-white tracking-[0.4em] placeholder:tracking-normal placeholder:text-stone-800"
              />
              {error && <p className="text-red-500 text-xs font-bold text-center mt-2 animate-pulse">{error}</p>}
            </div>

            <button onClick={() => { setReportModal(null); setPassword(""); setError(""); }} className="w-full text-stone-600 font-black text-xs uppercase tracking-widest hover:text-stone-200 transition-colors">戻る</button>
          </div>
        </div>
      )}

      {isAllDone && (
        <div className="flex justify-center pt-10">
          <button onClick={onAllFinished} className="w-full max-w-md py-7 btn-primary rounded-full text-3xl shadow-[0_20px_50px_rgba(217,119,6,0.35)] border-b-8 border-amber-800 active:translate-y-1 active:border-b-4 transition-all">
            ラウンド結果を集計
          </button>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
