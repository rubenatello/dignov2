import type { Article } from '@/types/article';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {(() => {
        const imgSrc = (article as any).featured_image_data?.url || article.featured_image || '';
        return imgSrc ? (
          <div className="relative h-48 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc} alt={article.title} className="w-full h-full object-cover" />
          </div>
        ) : null;
      })()}
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>{(article as any).author?.full_name || (article as any).author || ''}</span>
          <span className="mx-2">•</span>
          <time dateTime={(article as any).published_date}>
            {formatDate((article as any).published_date)}
          </time>
          <span className="mx-2">•</span>
          <span>{(article as any).view_count} views</span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {article.summary}
        </p>
        
        {(article as any).tags_list && (article as any).tags_list.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(article as any).tags_list.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-accent text-secondary text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <Link
          href={`/articles/${article.slug}`}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
        >
          Read more
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}