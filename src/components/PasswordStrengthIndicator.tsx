import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const calculateStrength = (password: string): number => {
  let score = 0;
  if (!password) return 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

const strengthLevels = [
  { text: 'Muito Fraca', color: 'bg-destructive' },
  { text: 'Fraca', color: 'bg-destructive' },
  { text: 'Média', color: 'bg-yellow-500' },
  { text: 'Forte', color: 'bg-green-500' },
  { text: 'Forte', color: 'bg-green-500' },
  { text: 'Muito Forte', color: 'bg-green-600' },
];

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  const strength = calculateStrength(password);
  const level = strengthLevels[strength];

  if (!password) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="grid grid-cols-5 gap-1 w-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1.5 rounded-full transition-colors',
              index < strength ? level.color : 'bg-muted'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground w-24 text-right">{level.text}</span>
    </div>
  );
};