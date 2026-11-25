import {CallerAvatar} from '../../callers/CallerAvatar/CallerAvatar';
import {formatInr, type AdminReceiverListItem} from '../../../api/receivers';
import {RANK_TIPS} from '../../../data/rankTips';
import styles from './TopPerformerRanking.module.css';

const PEDESTAL = {
  1: {height: 110, color: '#F5C542'},
  2: {height: 84, color: '#D9A8FC'},
  3: {height: 68, color: '#D6A574'},
} as const;

function PodiumSlot({
  place,
  receiver,
}: {
  place: 1 | 2 | 3;
  receiver?: AdminReceiverListItem;
}) {
  const {height, color} = PEDESTAL[place];
  return (
    <div className={styles.slot}>
      {place === 1 ? <span className={styles.crown}>👑</span> : null}
      <div className={styles.avatarRing} style={{borderColor: color}}>
        {receiver ? (
          <CallerAvatar name={receiver.name} size={place === 1 ? 'lg' : 'md'} />
        ) : (
          <span className={styles.emptyAvatar}>?</span>
        )}
      </div>
      <p className={styles.name}>{receiver?.name || '—'}</p>
      <p className={styles.points}>
        {receiver ? formatInr(receiver.earnings) : '₹ 0'}
      </p>
      <div
        className={styles.pedestal}
        style={{height, background: color}}
      >
        <span>#{place}</span>
      </div>
    </div>
  );
}

/** Top 3 receivers shown as a podium, like the receiver app's leaderboard. */
export function TopPerformerPodium({
  top,
}: {
  top: AdminReceiverListItem[];
}) {
  return (
    <section className={styles.podiumCard} aria-label="Top 3 performers">
      <h2 className={styles.heading}>Top 3 Performers</h2>
      <div className={styles.podiumRow}>
        <PodiumSlot place={2} receiver={top[1]} />
        <PodiumSlot place={1} receiver={top[0]} />
        <PodiumSlot place={3} receiver={top[2]} />
      </div>
    </section>
  );
}

/** "How to Improve Rank" instructions, same content as the receiver app. */
export function RankInstructions({currentRank}: {currentRank?: number | null}) {
  return (
    <section className={styles.tipsCard} aria-label="How to improve rank">
      <div className={styles.tipsHeader}>
        <h2 className={styles.heading}>How to Improve Rank</h2>
        <p className={styles.tipsSub}>
          Guidelines receivers follow to climb the leaderboard
          {currentRank ? ` · Current top rank #${currentRank}` : ''}
        </p>
      </div>
      <ol className={styles.tipsList}>
        {RANK_TIPS.map((tip, index) => (
          <li key={tip.id} className={styles.tip}>
            <span className={styles.tipIndex}>{index + 1}</span>
            <div>
              <p className={styles.tipTitle}>{tip.title}</p>
              <p className={styles.tipDesc}>{tip.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
