import { Team } from './types';

export const TEAMS: Team[] = [
  {
    id: 1,
    name: "チーム①",
    players: ["下田", "佐藤", "豊川", "時"]
  },
  {
    id: 2,
    name: "チーム②",
    players: ["小畑", "小林", "松井", "辻井", "林"] // 5名（うち1名は各回戦の補欠）
  },
  {
    id: 3,
    name: "チーム③",
    players: ["大庭", "下村", "川上", "趙"]
  },
  {
    id: 4,
    name: "チーム④",
    players: ["秀村", "山崎", "熱田", "小泉"]
  }
];

// 4チーム総当たり3回戦（前回と同じ対戦順）
export const ROUND_CONFIGS = [
  { round: 1, pairings: [[1, 2], [3, 4]] },
  { round: 2, pairings: [[1, 3], [2, 4]] },
  { round: 3, pairings: [[1, 4], [2, 3]] }
];

// 4 vs 4 / スロット4つ (前回と同じ)
export const SLOTS: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

// 補欠ありのチームID（チーム②のみ）
export const TEAM_WITH_SUBSTITUTE = 2;

// 補欠のキー名
export const SUBSTITUTE_KEY = 'substitute';

export const PASSWORD_REPORT = "maki";
