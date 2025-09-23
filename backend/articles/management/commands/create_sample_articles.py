from django.core.management.base import BaseCommand
from articles.models import Article
from users.models import User
from django.utils import timezone

class Command(BaseCommand):
    help = 'Create sample articles for development and testing.'

    def handle(self, *args, **options):
        admin = User.objects.filter(is_superuser=True).first()
        if not admin:
            self.stdout.write(self.style.ERROR('No superuser found. Please create one first.'))
            return

        articles = [
            {
                'title': 'Digno Launches: A New Era for Independent News',
                'category': 'NEWS',
                'summary': 'Digno launches to provide unbiased, data-driven journalism for all.',
                'is_breaking_news': True,
            },
            {
                'title': 'Opinion: Why Media Independence Matters',
                'category': 'OPINION',
                'summary': 'Exploring the importance of independent journalism in a democracy.',
                'is_breaking_news': False,
            },
            {
                'title': 'Economy Watch: Inflation Trends in 2025',
                'category': 'ECONOMY',
                'summary': 'Analyzing the latest inflation data and what it means for families.',
                'is_breaking_news': True,
            },
            {
                'title': 'Legislation Update: New Press Freedom Laws',
                'category': 'LEGISLATION',
                'summary': 'A look at recent laws affecting press freedom in the country.',
                'is_breaking_news': False,
            },
            {
                'title': 'Human Rights: Journalists on the Front Lines',
                'category': 'HUMAN_RIGHTS',
                'summary': 'Stories from journalists reporting in challenging environments.',
                'is_breaking_news': False,
            },
        ]

        for art in articles:
            article, created = Article.objects.get_or_create(
                title=art['title'],
                defaults={
                    'summary': art['summary'],
                    'category': art['category'],
                    'author': admin,
                    'is_breaking_news': art['is_breaking_news'],
                    'published_date': timezone.now(),
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created: {article.title}"))
            else:
                self.stdout.write(self.style.WARNING(f"Already exists: {article.title}"))
