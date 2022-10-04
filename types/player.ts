import { Match } from ".";

export default interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
  matches: Array<Match>;
}
