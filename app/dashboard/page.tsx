import { ResumeProvider } from '@/contexts/ResumeContext';
import { ResumeBuilder } from '@/components/ResumeBuilder';
import { ThemeColorProvider } from '@/contexts/ThemeColorProvider';
import AuthGate from '@/components/AuthGate';

export default function DashboardPage() {
  return (
    <AuthGate>
      <ResumeProvider>
        <ThemeColorProvider>
          <ResumeBuilder />
        </ThemeColorProvider>
      </ResumeProvider>
    </AuthGate>
  );
}