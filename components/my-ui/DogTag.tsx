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
    <div className="w-full h-auto aspect-[3/1] relative">
      <div className="absolute inset-0 bg-[url('/images/dogtag.png')] bg-contain bg-no-repeat bg-center min-h-[200px] max-h-[300px]"></div>
      <div className="relative z-10 flex flex-col align-start justify-start h-full pt-2 text-gray-700 gap-5">
        <h2 className="text-sm md:text-xl font-bold md:mb-2 mt-4 text-center md:-indent-1 lg:-indent-10 [text-shadow:_3px_2px_3px_#838383]">{playerName}</h2>
        <p className="text-xl md:text-2xl font-bold text-center indent-2 md:-indent-6 [text-shadow:_3px_2px_3px_#838383]">
          ETH: {ethBalance && <AnimatedNumber endValue={parseFloat(ethBalance)} decimalPlaces={4} />}
        </p>
        <p className="text-xl md:text-2xl font-bold text-center md:-indent-4 [text-shadow:_3px_2px_3px_#838383]">
          Tokens: {tokenBalance && <AnimatedNumber endValue={parseFloat(tokenBalance)} decimalPlaces={3} />}
        </p>
      </div>
    </div>
  );
};

export default DogTag;
