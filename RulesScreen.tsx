
import React, { useState } from 'react';

interface Props {
  onNext: () => void;
}

const RulesScreen: React.FC<Props> = ({ onNext }) => {
  const [page, setPage] = useState(0);

  const rules = [
    {
      title: "基本ルール",
      items: [
        "1チーム4名、全3回戦の総当たり形式です。",
        "各対局はA・B・C・Dの4スロットで同時に進行します。",
        "3勝以上で勝利、2勝2敗で引き分けとなります。",
        "結果は各自アプリ上で正確に報告してください。"
      ]
    },
    {
      title: "オーダー決定",
      items: [
        "対局開始前に、誰がどのスロットに出場するかを登録します。",
        "登録が完了するまで、他チームのオーダーは公開されません。",
        "公平性を保つため、登録後の変更はできません。"
      ]
    },
    {
      title: "進行手順",
      items: [
        "1. オーダー提出：各チームの責任者が登録を行います。",
        "2. 対局：表示された座席に移動し、速やかに開始してください。",
        "3. 勝敗報告：対局終了後、勝利した側がパスワードを入力し報告します。",
        "4. 集計：全局終了後、ラウンド結果が確定します。"
      ]
    }
  ];

  return (
    <div className="bg-stone-900 border border-stone-800 p-8 rounded-lg shadow-xl animate-fadeIn">
      <div className="mb-6">
        <span className="text-stone-500 text-xs font-bold tracking-widest uppercase">Guide</span>
        <h2 className="text-2xl font-bold font-shogi text-stone-200 mt-1">
          {rules[page].title}
        </h2>
      </div>
      
      <ul className="space-y-4 mb-10">
        {rules[page].items.map((item, idx) => (
          <li key={idx} className="flex items-start space-x-3">
            <span className="mt-2 w-1.5 h-1.5 bg-stone-600 shrink-0" />
            <span className="text-lg text-stone-300">{item}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center border-t border-stone-800 pt-6">
        <div className="flex space-x-2">
          {rules.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-colors ${idx === page ? 'bg-stone-400' : 'bg-stone-700'}`}
            />
          ))}
        </div>
        
        {page < rules.length - 1 ? (
          <button 
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded font-medium transition-all"
          >
            次へ
          </button>
        ) : (
          <button 
            onClick={onNext}
            className="px-8 py-2 bg-stone-200 text-stone-900 hover:bg-white rounded font-bold transition-all"
          >
            確認しました
          </button>
        )}
      </div>
    </div>
  );
};

export default RulesScreen;
