
import React from 'react';

interface Props {
  onStart: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="text-center animate-fadeIn space-y-12">
      <div className="space-y-4">
        <span className="text-amber-600 text-xs font-black uppercase tracking-[0.5em] block">SGP Shogi Federation</span>
        <h1 className="text-6xl md:text-7xl font-black font-serif-shogi text-white drop-shadow-[0_0_20px_rgba(217,119,6,0.3)]">
          冬季合宿 団体戦
        </h1>
        <div className="accent-line max-w-xs mx-auto"></div>
        <p className="text-xl text-stone-300 font-medium">進行管理・スコアリングシステム</p>
      </div>
      
      <div className="pt-8">
        <button
          onClick={onStart}
          className="px-24 py-7 btn-primary rounded-full text-3xl active:scale-95 shadow-[0_0_50px_rgba(217,119,6,0.2)]"
        >
          大会を開始する
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
