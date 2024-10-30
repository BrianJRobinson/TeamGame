import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

interface InfoCardProps {
  title: string;
  content: string;
}

const InfoCard = ({ title, content }: InfoCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg text-white mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center">{content}</p>
      </CardContent>
    </Card>
  );
};

export default InfoCard;