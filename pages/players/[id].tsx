import Player from "@/components/Player";
import Match from "@/components/Match";
import type { Player as PlayerType, Match as MatchType } from "@/types";
import styles from "./Player.module.scss";

export async function getServerSideProps({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const playerResult = await fetch(
    `http://127.0.0.1:8080/v1/players/${id}?matches=100`
  );
  const playerData = await playerResult.json();
  const player = playerData.data;
  return {
    props: { player },
  };
}

interface PlayerProps {
  player: PlayerType;
}

export default function PlayerPage({ player }: PlayerProps) {
  return (
    <section className={styles.wrapper}>
      <Player player={player} expanded />
      <div className={styles.matches}>
        {player.matches.map((match: MatchType) => (
          <Match
            key={match.id}
            teamA={match.teamA}
            teamB={match.teamB}
            winnerId={match.teamWonId}
            createdAt={match.createdAt}
          />
        ))}
      </div>
    </section>
  );
}
