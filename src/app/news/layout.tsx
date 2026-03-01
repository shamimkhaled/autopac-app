import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry News & Global Insights',
  description: 'Stay updated with the latest trends in food processing, packaging, and industrial technology from Bangladesh and around the world.',
  openGraph: {
    title: 'Industry News | Auto Pac Machinery',
    description: 'Real-time aggregation of industrial and global news feeds.',
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
