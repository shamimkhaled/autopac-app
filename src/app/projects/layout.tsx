import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects — Auto Pac Industrial Installations',
  description: 'Explore Auto Pac\'s completed and ongoing industrial machinery installation projects across Bangladesh. Real-world examples of our engineering solutions.',
  openGraph: {
    title: 'Projects — Auto Pac',
    description: 'Industrial machinery installation projects by Auto Pac across Bangladesh.',
    url: 'https://autopacbd.com/projects',
  },
  alternates: { canonical: 'https://autopacbd.com/projects' },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
