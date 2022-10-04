import { Team, Match } from ".";

export default interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
  teams: Array<string>;
  matches: Array<Match>;
}
