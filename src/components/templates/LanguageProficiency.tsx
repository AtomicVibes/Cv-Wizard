import { cn } from '@/lib/utils';

const proficiencyLevels: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Native: 5,
};

export function LanguageProficiency({
  proficiency,
  themeColor,
  className,
}: {
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  themeColor: string;
  className?: string;
}) {
  const filled = proficiencyLevels[proficiency] ?? 0;

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="img"
      aria-label={`${proficiency} proficiency (${filled} of 5)`}
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: i < filled ? `hsl(${themeColor})` : '#d1d5db' }}
        />
      ))}
    </div>
  );
}
