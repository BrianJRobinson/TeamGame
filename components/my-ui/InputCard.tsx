import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface InputCardProps {
  cardNumber: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  inputPlaceholder: string;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText: string;
  onButtonClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  animationDelay?: string;
  maxChars: number; // New prop for maximum characters
  minChars: number; // New prop for minimum characters
}

const InputCard: React.FC<InputCardProps> = ({
  cardNumber,
  title,
  imageSrc,
  imageAlt,
  inputPlaceholder,
  inputValue,
  onInputChange,
  buttonText,
  onButtonClick,
  isLoading,
  isDisabled,
  animationDelay = '',
  maxChars,
  minChars,
}) => {
  // Handler to limit input length
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, maxChars);
    onInputChange({ ...e, target: { ...e.target, value } });
  };

  return (
    <Card className={`bg-white/10 backdrop-blur-lg text-white overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 animate-slide-up ${animationDelay}`}>
      <div className="flex">
        <div className="w-1/3 flex items-start justify-start rounded-lg">
          <Image src={imageSrc} alt={imageAlt} width={100} height={100} className="md:rounded-l-lg rounded-tl-lg lg:h-full sm:h-50 w-full" />
        </div>
        <div className="w-4/5">
          <CardHeader>
            <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-muted-white">
            <span className="text-sm font-bold">{cardNumber}</span>
          </div>
          <CardTitle>{title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={handleInputChange}
              className="mb-4"
              disabled={isDisabled}
              maxLength={maxChars}
            />
            <div className="text-sm text-gray-400 mb-2">
              {inputValue.length}/{maxChars} characters
            </div>
            <Button
              onClick={onButtonClick}
              disabled={isDisabled || inputValue.trim().length < minChars || isLoading}
            >
              {isLoading ? 'Processing...' : buttonText}
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default InputCard;