"""
Django management command to create sample articles for testing
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from articles.models import Article
from datetime import datetime, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Create sample articles for testing the platform'

    def handle(self, *args, **options):
        # Get or create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@digno.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(
                self.style.SUCCESS('Created admin user (admin/admin123)')
            )

        # Sample articles data
        sample_articles = [
            {
                'title': 'The Future of Independent Journalism',
                'slug': 'future-independent-journalism',
                'summary': 'Exploring how digital platforms are changing the landscape of independent journalism and what it means for democracy.',
                'content': '''
                <h2>The Digital Revolution in Journalism</h2>
                <p>Independent journalism is experiencing a renaissance in the digital age. With traditional media consolidating and facing financial pressures, independent journalists and small newsrooms are finding new ways to connect directly with their audiences.</p>
                
                <h3>Key Trends Shaping the Future</h3>
                <ul>
                    <li><strong>Direct Reader Support:</strong> Platforms like Patreon, Substack, and donation-based models are enabling journalists to build sustainable businesses.</li>
                    <li><strong>Niche Expertise:</strong> Independent journalists are thriving by covering specialized topics that mainstream media often overlooks.</li>
                    <li><strong>Community Engagement:</strong> Social media and email newsletters create direct relationships between journalists and readers.</li>
                </ul>
                
                <h3>Challenges and Opportunities</h3>
                <p>While the opportunities are significant, independent journalists face unique challenges including limited resources, the need for multiple skills, and the constant pressure to build and maintain an audience.</p>
                
                <blockquote>
                    <p>"The future of journalism lies not in large corporations, but in passionate individuals who can build direct relationships with their communities." - Jane Doe, Media Analyst</p>
                </blockquote>
                
                <h3>The Path Forward</h3>
                <p>Successful independent journalism requires a combination of quality reporting, business acumen, and community building. Platforms that support these efforts while maintaining editorial independence will be crucial for the future of democratic discourse.</p>
                ''',
                'tags': 'journalism, media, digital, independent',
                'meta_description': 'Exploring the future of independent journalism in the digital age and its impact on democracy.',
                'is_published': True,
                'view_count': 1247,
            },
            {
                'title': 'Building Sustainable Communities Through Local News',
                'slug': 'sustainable-communities-local-news',
                'summary': 'How local journalism creates stronger communities and why supporting local news matters more than ever.',
                'content': '''
                <h2>The Power of Local Journalism</h2>
                <p>Local journalism serves as the backbone of democratic communities. When local news thrives, communities are more informed, engaged, and connected.</p>
                
                <h3>Why Local News Matters</h3>
                <p>Local journalism provides several critical functions that national media cannot replicate:</p>
                
                <ol>
                    <li><strong>Government Accountability:</strong> Local reporters attend city council meetings, school board sessions, and county commissioner hearings.</li>
                    <li><strong>Community Connection:</strong> Coverage of local events, businesses, and people creates shared experiences.</li>
                    <li><strong>Emergency Information:</strong> During crises, local news provides vital information about road closures, weather, and safety.</li>
                    <li><strong>Economic Development:</strong> Reporting on local business and economic trends helps communities make informed decisions.</li>
                </ol>
                
                <h3>The Crisis and the Solution</h3>
                <p>Many communities have lost their local newspapers in recent years, creating "news deserts" where important local stories go uncovered. However, innovative solutions are emerging:</p>
                
                <ul>
                    <li>Non-profit newsrooms supported by community donations</li>
                    <li>Membership-based local news organizations</li>
                    <li>Cooperative journalism models</li>
                    <li>Newsletter-based local reporting</li>
                </ul>
                
                <p>Supporting local journalism isn't just about supporting news - it's about investing in the health and vitality of our communities.</p>
                ''',
                'tags': 'local news, community, democracy, civic engagement',
                'meta_description': 'Discover how local journalism builds stronger communities and why supporting local news is crucial.',
                'is_published': True,
                'view_count': 892,
            },
            {
                'title': 'The Ethics of Crowdfunded Journalism',
                'slug': 'ethics-crowdfunded-journalism',
                'summary': 'Examining the ethical considerations and best practices for journalists who rely on reader funding.',
                'content': '''
                <h2>Navigating Ethical Waters</h2>
                <p>As more journalists turn to crowdfunding and direct reader support, new ethical questions arise. How do we maintain editorial independence while being responsive to supporters?</p>
                
                <h3>Key Ethical Considerations</h3>
                
                <h4>Editorial Independence</h4>
                <p>The primary concern is maintaining editorial independence. Best practices include:</p>
                <ul>
                    <li>Clear policies about editorial control</li>
                    <li>Transparency about funding sources</li>
                    <li>Separating business and editorial decisions</li>
                </ul>
                
                <h4>Transparency with Supporters</h4>
                <p>Reader-funded journalism requires unprecedented transparency:</p>
                <ul>
                    <li>Regular updates on how funds are used</li>
                    <li>Clear explanation of editorial policies</li>
                    <li>Open communication about challenges and successes</li>
                </ul>
                
                <h3>Building Trust</h3>
                <p>Trust is the currency of independent journalism. Successful crowdfunded journalists build trust through:</p>
                
                <ol>
                    <li><strong>Consistent Quality:</strong> Delivering valuable content regularly</li>
                    <li><strong>Authenticity:</strong> Being genuine about motivations and limitations</li>
                    <li><strong>Accountability:</strong> Acknowledging mistakes and correcting them promptly</li>
                    <li><strong>Community:</strong> Creating spaces for meaningful dialogue with readers</li>
                </ol>
                
                <p>The future of journalism may well depend on these new models of reader support, making ethical practices more important than ever.</p>
                ''',
                'tags': 'ethics, journalism, crowdfunding, transparency',
                'meta_description': 'Exploring ethical considerations and best practices for crowdfunded journalism.',
                'is_published': False,  # This one is a draft
                'view_count': 0,
            },
            {
                'title': 'Tools and Technology for Independent Journalists',
                'slug': 'tools-technology-independent-journalists',
                'summary': 'A comprehensive guide to the essential tools and technologies that can help independent journalists work more efficiently and effectively.',
                'content': '''
                <h2>Essential Tools for Modern Journalism</h2>
                <p>Independent journalists need to be efficient and resourceful. The right tools can make the difference between success and burnout.</p>
                
                <h3>Writing and Publishing</h3>
                <h4>Content Management</h4>
                <ul>
                    <li><strong>Notion:</strong> All-in-one workspace for research, writing, and planning</li>
                    <li><strong>Google Docs:</strong> Collaborative writing and easy sharing</li>
                    <li><strong>Ghost:</strong> Clean, focused publishing platform</li>
                    <li><strong>Substack:</strong> Newsletter platform with built-in monetization</li>
                </ul>
                
                <h3>Research and Organization</h3>
                <h4>Information Gathering</h4>
                <ul>
                    <li><strong>Zotero:</strong> Research management and citation</li>
                    <li><strong>Pocket:</strong> Save and organize articles for later</li>
                    <li><strong>Airtable:</strong> Database for sources and story tracking</li>
                </ul>
                
                <h3>Audio and Video</h3>
                <h4>Recording and Editing</h4>
                <ul>
                    <li><strong>Zoom:</strong> High-quality remote interviews</li>
                    <li><strong>Audacity:</strong> Free audio editing software</li>
                    <li><strong>OBS Studio:</strong> Free video recording and streaming</li>
                    <li><strong>Canva:</strong> Simple graphic design for social media</li>
                </ul>
                
                <h3>Business and Analytics</h3>
                <h4>Understanding Your Audience</h4>
                <ul>
                    <li><strong>Google Analytics:</strong> Website traffic analysis</li>
                    <li><strong>ConvertKit:</strong> Email newsletter management</li>
                    <li><strong>Stripe:</strong> Payment processing for subscriptions</li>
                    <li><strong>Buffer:</strong> Social media scheduling and analytics</li>
                </ul>
                
                <h3>Security and Privacy</h3>
                <p>Protecting sources and data is crucial:</p>
                <ul>
                    <li><strong>Signal:</strong> Encrypted messaging</li>
                    <li><strong>ProtonMail:</strong> Secure email</li>
                    <li><strong>VPN services:</strong> Protect browsing privacy</li>
                    <li><strong>Two-factor authentication:</strong> Secure all accounts</li>
                </ul>
                
                <p>The key is finding tools that fit your workflow and budget while maintaining professional standards.</p>
                ''',
                'tags': 'tools, technology, journalism, productivity',
                'meta_description': 'Essential tools and technologies for independent journalists to work efficiently.',
                'is_published': True,
                'view_count': 1543,
            }
        ]

        created_count = 0
        for article_data in sample_articles:
            # Check if article already exists
            if not Article.objects.filter(slug=article_data['slug']).exists():
                article = Article.objects.create(
                    author=admin_user,
                    title=article_data['title'],
                    slug=article_data['slug'],
                    summary=article_data['summary'],
                    content=article_data['content'],
                    tags=article_data['tags'],
                    meta_description=article_data['meta_description'],
                    is_published=article_data['is_published'],
                    view_count=article_data['view_count'],
                )
                
                # Set published date for published articles
                if article.is_published:
                    article.published_date = datetime.now() - timedelta(days=created_count * 2)
                    article.save()
                
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created article: {article.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Article already exists: {article_data["title"]}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Sample content creation complete! Created {created_count} new articles.')
        )
        self.stdout.write(
            self.style.SUCCESS('You can now visit http://localhost:8000/admin/ to see your beautiful writer dashboard!')
        )