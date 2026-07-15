
import { Team } from './types';

export const TEAMS: Team[] = [
  {
    id: 1,
    name: "チーム①",
    players: ["下田 聖", "佐藤 仁紀", "豊川 晴一朗"]
  },
  {
    id: 2,
    name: "チーム②",
    players: ["小畑 貴慈", "辻井 琥基", "林 志銘"]
  },
  {
    id: 3,
    name: "チーム③",
    players: ["大庭 悠誠", "川上 諒", "趙 龍晧"]
  },
  {
    id: 4,
    name: "チーム④",
    players: ["下村 篤生", "小林 慈人", "時 一然"]
  },
  {
    id: 5,
    name: "チーム⑤",
    players: ["秀村 紘嗣", "熱田 望", "小泉 将成"]
  },
  {
    id: 6,
    name: "チーム⑥",
    players: ["山崎 泰蔵", "池田 大翔", "松井 俐真"]
  }
];

export const ROUND_CONFIGS = [
  { round: 1, pairings: [[1, 2], [3, 4], [5, 6]] },
  { round: 2, pairings: [[1, 3], [2, 5], [4, 6]] },
  { round: 3, pairings: [[1, 4], [2, 6], [3, 5]] }
];

export const SLOTS: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];

export const PASSWORD_REPORT = "maki";
