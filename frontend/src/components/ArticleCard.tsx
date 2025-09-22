import { Article } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

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
      {article.featured_image && (
        <div className="relative h-48 w-full">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>{article.author.full_name}</span>
          <span className="mx-2">•</span>
          <time dateTime={article.published_date}>
            {formatDate(article.published_date)}
          </time>
          <span className="mx-2">•</span>
          <span>{article.view_count} views</span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {article.summary}
        </p>
        
        {article.tags_list.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags_list.map((tag, index) => (
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