Project Digno
Project Overview
Digno is a modern, independent news platform built to deliver high-quality journalism with a focus on a robust user experience and an efficient internal content management system. The platform will serve two primary user groups:
Regular Subscribers: Can read, subscribe, comment on, and engage with articles.
Organizational Users (Admins, Writers, Editors): Have access to a private, feature-rich admin dashboard for article creation, editing, and analytics.
The name "Digno" (from the Latin word for "worthy" or "dignified") reflects the project's commitment to quality and integrity in news reporting.
Technology Stack
Backend
Django: The core of our backend. Chosen for its "batteries-included" philosophy, making it quick to develop and easy to scale. Its robust admin panel is a perfect foundation for our internal dashboard.
SQLite (Development): A simple, file-based database for local development, allowing for quick setup without external dependencies.
Quill.js or similar rich-text editor: For the article writer and editor. This is a crucial component that will provide a robust WYSIWYG (What You See Is What You Get) experience with features like:
Draft saving
Undo/redo functionality
Version history
Image and link embedding
Collaboration tools (if required in a later phase)
Stripe (or similar): For managing user subscriptions securely.
Google Analytics API (or similar): For fetching and displaying website performance data within the admin dashboard.
Folder Structure (Proposed)
/digno
├── /backend            # Django project
│   ├── /digno          # Core Django settings
│   ├── /articles       # Articles app (models, views, etc.)
│   ├── /users          # User management app
│   ├── /dashboard      # Admin dashboard app
│   └── manage.py
│
# Digno v2

## Development: Docker-first

To avoid Codespaces port forwarding and CORS/CSRF headaches, we run the full stack in Docker during development.

### Database Configuration

**🐘 PostgreSQL Database (Docker Environment)**
- **Database**: PostgreSQL 15.14 running in Docker container
- **Connection**: Django connects via `DATABASE_URL=postgresql://digno:digno123@db:5432/digno`
- **Data Persistence**: All new content, users, and articles are stored in PostgreSQL
- **Migration Status**: ✅ Migrated from SQLite with existing admin user and content

**📝 Important**: We switched from SQLite to PostgreSQL for Docker development. All future data (articles, users, etc.) will be stored in the PostgreSQL container with persistent volumes.

Quick start:

1. Stop any local dev servers.
2. From the repo root, build and start all services:

```bash
docker-compose up --build
```

3. Open the apps:
   - Frontend: http://localhost:3000
   - Backend API/DRF: http://localhost:8000/api/
   - Django Admin: http://localhost:8000/admin/ (admin/admin123)

Frontend API calls should use relative paths like `/api/articles/`. Next.js proxies these to Django via a rewrite. In Docker, the proxy targets the `web` service (http://web:8000); outside Docker, it targets `http://localhost:8000`.

If you change `next.config.mjs`, restart the frontend dev server (or recompose) so rewrites take effect.│   ├── /app            # New App Router structure
│   ├── public          # Static assets (images, fonts, etc.)
│   └── tailwind.config.js
├── README.md
├── docker-compose.yml  # To be created for production
└── requirements.txt    # Python dependencies


UI/UX Design
Color Palette
Primary: #516fff (A vibrant, professional blue)
Secondary: #2d2d2d (A dark gray for text and backgrounds)
Typography & Visuals
The design should be clean, modern, and easy to read.
We will use the provided logo.png and favicon.png for branding. - The site will be fully responsive, adapting to desktop, tablet, and mobile views.
User Journeys
Regular Subscriber
Homepage: Views the latest articles, trending news, and a call-to-action to subscribe.
Article Page: Reads the full article, sees related content, and can comment, like, or share.
Subscription: Clicks "Subscribe," is directed to a secure payment form, and gains full access to premium content.
Organizational User (Admin, Writer, Editor)
Login: Logs into the internal dashboard.
Dashboard Home: Sees a quick overview of website performance (analytics, new comments, top articles).
Article Management: Navigates to the article section to create, edit, or view articles. The editor will be a full-screen, robust writing interface.
Analytics: Views detailed reports on page views, user engagement, and traffic sources.
Future AI Integration
The Django backend is chosen with future AI integration in mind. We plan to use the API to connect with AI models for tasks such as:
Article Summarization: Automatically generating short summaries for each article.
Content Tagging: Using natural language processing (NLP) to tag articles with relevant keywords.
User Personalization: Recommending articles to users based on their reading history.
Development Checklist
✅ Set up the Django backend with a basic articles app and users app.
✅ Implement user authentication and permissions (using Django's built-in system).
✅ Create the Next.js frontend with Tailwind CSS configured.
✅ Build the public-facing article list and individual article pages.
✅ Integrate a rich-text editor for article creation within the Django admin.
✅ Develop the separate admin dashboard frontend with a restricted sidebar and secure routes.
⏳ Set up PostgreSQL for the production environment. (Ready for Railway deployment)
⏳ Integrate a subscription management system. (Stripe infrastructure ready)
⏳ Deploy the application. (Deployment configs ready)

## Current Status

✅ **MVP Complete!** The basic platform is functional with:
- Django backend with custom user model
- Article management system with CKEditor
- Donation model ready for Stripe integration
- Next.js frontend with responsive design
- Railway + Vercel deployment configurations
- Django admin interface for content management

## Quick Start

### Development Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Access Points
- Frontend: http://localhost:3000
- Django Admin: http://localhost:8000/admin/
- API: http://localhost:8000/api/

### Admin Credentials
- Username: admin
- Password: admin123

## Next Steps
1. **Deploy to Production**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Add Content**: Create articles via Django admin
3. **Stripe Integration**: Add live payment processing
4. **Custom Features**: Implement additional features as needed

## Deployment Ready
The project is configured for:
- **Railway**: Django backend + PostgreSQL
- **Vercel**: Next.js frontend
- **Estimated Cost**: $10-20/month for small production site
