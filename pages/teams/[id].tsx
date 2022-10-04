import Team from "@/components/Team";
import Match from "@/components/Match";
import type { Team as TeamType, Match as MatchType } from "@/types";
import styles from "./Team.module.scss";

export async function getServerSideProps({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const teamResult = await fetch(
    `http://127.0.0.1:8080/v1/teams/${id}?matches=100&includeFullMatches=true`
  );
  const teamData = await teamResult.json();
  const team = teamData.data;
  return {
    props: { team },
  };
}

interface TeamProps {
  team: TeamType;
}

export default function Teams({ team }: TeamProps) {
  return (
    <section className={styles.wrapper}>
      <Team team={team} />
      <div className={styles.matches}>
        {team.matches.map((match: MatchType) => (
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
