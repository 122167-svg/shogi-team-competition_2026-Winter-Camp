import React, { useState } from 'react';

interface Props {
  onNext: () => void;
}

const RulesScreen: React.FC<Props> = ({ onNext }) => {
  const [page, setPage] = useState(0);

  const rules = [
    {
      title: "大会概要・基本ルール",
      items: [
        "各チームは4名で構成（前回は4 vs 4）、今回は4チームによる全3回戦の総当たり戦です。",
        "各試合はスロット A・B・C・D の4面で同時進行します。",
        "【チーム勝敗】3勝以上でチーム勝利 (勝ち点2)、2勝は引き分け (勝ち点1)、1勝以下は負け (勝ち点0)。",
        "対局時計は使用せず、勝敗は自己申告制（管理者パスワード: maki）。"
      ]
    },
    {
      title: "戦略フェーズ：オーダー提出",
      items: [
        "対局前に、各チーム非公開でスロットの割り当てを行います。",
        "全チームの登録が完了するまで相手の布陣は見えません。",
        "登録完了後はロックされ、変更は一切不可となります。",
        "相手強者に誰をぶつけるか、チームの戦略が問われます。"
      ]
    },
    {
      title: "チーム②の補欠運用（対局毎に変動可）",
      items: [
        "チーム②のみ、登録メンバー5名のうち4名がスロットA〜Dに入り、1名を補欠として指定します。",
        "補欠は対局毎に自由に変更可能（補欠のみ別選手にすることも可能）。",
        "スロット4名はユニーク（重複不可）。補欠はスロットの4名と異なる選手を指名してください。",
        "補欠に指定された選手はベンチから観戦する想定です。"
      ]
    },
    {
      title: "対局・結果報告の流れ",
      items: [
        "1. 指定された座席（配置図参照）に移動し、相手と挨拶を交わして開始。",
        "2. 終了したスロットから、管理者パスワード maki を入力して勝敗を報告。",
        "3. 全スロット集計後、次に進むと結果が発表されます。",
        "4. 全ラウンド終了後に最終順位と個人表彰を発表します。"
      ]
    }
  ];

  return (
    <div className="card border-amber-600/20 p-10 shadow-2xl animate-fadeIn max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.3em]">Official Guide</span>
          <h2 className="text-3xl font-black font-serif-shogi text-white">
            {rules[page].title}
          </h2>
        </div>
        <div className="text-amber-500 font-black text-xl italic opacity-20">0{page + 1}</div>
      </div>

      <ul className="space-y-6">
        {rules[page].items.map((item, idx) => (
          <li key={idx} className="flex items-start space-x-4 group">
            <span className="mt-1.5 w-2 h-2 bg-amber-600 rounded-full group-hover:scale-125 transition-transform shrink-0" />
            <span className="text-xl text-stone-100 font-medium leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center pt-8 border-t border-zinc-800">
        <div className="flex space-x-3">
          {rules.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === page ? 'w-8 bg-amber-500' : 'w-2 bg-zinc-800'}`}
            />
          ))}
        </div>

        {page < rules.length - 1 ? (
          <button
            onClick={() => setPage(page + 1)}
            className="px-10 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-black text-sm transition-all border border-zinc-700"
          >
            次へ
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-12 py-3 btn-primary rounded-full text-sm active:scale-95"
          >
            ルールを承諾する
          </button>
        )}
      </div>
    </div>
  );
};

export default RulesScreen;
