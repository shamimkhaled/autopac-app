import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

const FEEDS = [
  {
    name: 'Prothom Alo',
    url: 'https://www.prothomalo.com/feed',
    category: 'bangladesh',
  },
  {
    name: 'The Daily Star',
    url: 'https://www.thedailystar.net/rss.xml',
    category: 'bangladesh',
  },
  {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    category: 'international',
  },
];

export async function GET() {
  try {
    const feedPromises = FEEDS.map(async (f) => {
      try {
        const feed = await parser.parseURL(f.url);
        return feed.items.map((item) => {
          // Extract thumbnail from various possible locations in RSS
          let thumbnail = '';
          if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
            thumbnail = item.mediaContent.$.url;
          } else if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
            thumbnail = item.mediaThumbnail.$.url;
          } else if (item.enclosure && item.enclosure.url) {
            thumbnail = item.enclosure.url;
          } else {
            // Fallback: try to find an image in content
            const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) thumbnail = imgMatch[1];
          }

          return {
            title: item.title ?? '',
            link: item.link ?? '',
            pubDate: item.pubDate ?? new Date().toISOString(),
            contentSnippet: item.contentSnippet ?? '',
            source: f.name,
            category: f.category,
            thumbnail: thumbnail,
          };
        });
      } catch (err) {
        console.error(`Error fetching feed ${f.name}:`, err);
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    const allNews = results.flat().sort((a, b) => {
      return new Date(b.pubDate ?? 0).getTime() - new Date(a.pubDate ?? 0).getTime();
    });

    return NextResponse.json(allNews, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('News aggregation error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
