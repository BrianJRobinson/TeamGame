import React from 'react';
import styles from '@/app/DogTag.module.css';

interface DogTagProps {
  playerName: string | null;
  ethBalance: string | null;
  tokenBalance: string | null;
}

const DogTag: React.FC<DogTagProps> = ({ playerName, ethBalance, tokenBalance }) => {
  return (
    <div className={styles.dogTagContainer}>
      <div className={styles.dogTag}>
        <div className={styles.hole}></div>
        <div className={styles.content}>
          <h2 className={styles.playerName}>{playerName}</h2>
          <p className={styles.balance}>ETH: {ethBalance}</p>
          <p className={styles.balance}>Tokens: {tokenBalance}</p>
        </div>
      </div>
      <div className={`${styles.dogTag} ${styles.behindTag}`}></div>
    </div>
  );
};

export default DogTag;
