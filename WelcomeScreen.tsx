
import React from 'react';

interface Props {
  onStart: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="text-center animate-fadeIn">
      <div className="mb-4">
        <span className="official-title text-sm font-bold uppercase tracking-widest text-stone-500">Official Tournament Management</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 font-shogi text-stone-200">
        巣鴨学園将棋班 冬季合宿<br/>
        <span className="text-2xl md:text-3xl mt-2 block opacity-80">団体戦 進行・管理システム</span>
      </h1>
      <div className="accent-line max-w-xs mx-auto mb-12"></div>
      
      <div className="relative inline-block">
        <button
          onClick={onStart}
          className="px-16 py-5 bg-stone-200 text-stone-900 rounded-sm font-bold text-xl hover:bg-white transition-all shadow-lg active:scale-95"
        >
          大会を開始する
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
