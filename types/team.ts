import { Player, Match } from ".";

export default interface Team {
  id: string;
  playerA: Player;
  playerB: Player;
  wins: number;
  losses: number;
  matches: Array<Match>;
}
