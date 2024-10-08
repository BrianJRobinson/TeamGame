import React, { useState, useEffect } from 'react';
import styles from '@/app/DogTag.module.css';

interface DogTagProps {
  playerName: string | null;
  ethBalance: string | null;
  tokenBalance: string | null;
}

const AnimatedNumber: React.FC<{ endValue: number, decimalPlaces: number }> = ({ endValue, decimalPlaces }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0.00001;
    const end = parseFloat(endValue.toString().replace(/[^0-9.-]+/g,""));
    const duration = 2000; // Animation duration in milliseconds
    const increment = (end - start) / (duration / 16); // 60 FPS
    //const decimalPlaces = Math.max(
    //  (end.toString().split('.')[1] || '').length,
    //  (start.toString().split('.')[1] || '').length
    //);

    const timer = setInterval(() => {
      start += increment;
      setCount(parseFloat(start.toFixed(decimalPlaces)));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [endValue]);

  return <span>{count.toFixed(decimalPlaces)}</span>;
};

const DogTag: React.FC<DogTagProps> = ({ playerName, ethBalance, tokenBalance }) => {
  return (
    <div className={styles.dogTagContainer}>
      <div className={styles.dogTag}>
        <div className={styles.hole}></div>
        <div className={styles.content}>
          <h2 className={styles.playerName}>{playerName}</h2>
          <p className={styles.balance}>ETH: {ethBalance && <AnimatedNumber endValue={parseFloat(ethBalance)} decimalPlaces={5} />}</p>
          <p className={styles.balance}>Tokens: {tokenBalance && <AnimatedNumber endValue={parseFloat(tokenBalance)} decimalPlaces={3} />}</p>
        </div>
      </div>
      <div className={`${styles.dogTag} ${styles.behindTag}`}></div>
    </div>
  );
};

export default DogTag;
