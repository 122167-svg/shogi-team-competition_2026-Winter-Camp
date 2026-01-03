
import { Team } from './types';

export const TEAMS: Team[] = [
  {
    id: 1,
    name: "チーム①",
    players: ["下田聖", "下村篤生", "布施皓己", "熱田望"]
  },
  {
    id: 2,
    name: "チーム②",
    players: ["小畑貴慈", "片山幸典", "岩間悠希", "松井俐真"]
  },
  {
    id: 3,
    name: "チーム③",
    players: ["大庭悠誠", "棚瀬侑真", "秋山七星", "中野琥太郎"]
  },
  {
    id: 4,
    name: "チーム④",
    players: ["高木翔玄", "龍口直史", "池田大翔", "槇啓秀"]
  }
];

export const ROUND_CONFIGS = [
  { round: 1, pairings: [[1, 2], [3, 4]] },
  { round: 2, pairings: [[1, 3], [2, 4]] },
  { round: 3, pairings: [[1, 4], [2, 3]] }
];

export const SLOTS: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

export const PASSWORD_REPORT = "4567";
