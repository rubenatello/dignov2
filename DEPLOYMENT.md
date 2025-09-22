# Digno Deployment Guide

This guide covers deploying the Digno news platform using Railway for the backend and Vercel for the frontend.

## Overview

- **Backend**: Django on Railway
- **Frontend**: Next.js on Vercel  
- **Database**: PostgreSQL (Railway managed)
- **Static Files**: Whitenoise (Django) + Vercel CDN

## Backend Deployment (Railway)

### 1. Prepare Railway Account
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub account
3. Install Railway CLI: `npm install -g @railway/cli`

### 2. Deploy Backend
1. Fork/push this repository to GitHub
2. In Railway dashboard, click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository and select the `backend` folder
5. Railway will automatically detect the Django app

### 3. Configure Environment Variables
In Railway dashboard, go to your project > Variables and add:

```bash
DEBUG=False
SECRET_KEY=your-super-secret-key-here-change-in-production
ALLOWED_HOSTS=your-app-name.railway.app,yourdomain.com

# Database - Railway provides this automatically
# DATABASE_URL will be set automatically

# CORS settings
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Stripe (when ready)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@domain.com
EMAIL_HOST_PASSWORD=your-password
EMAIL_USE_TLS=True
```

### 4. Add PostgreSQL Database
1. In Railway dashboard, click "New Service"
2. Select "PostgreSQL"
3. Railway will automatically connect it to your Django app

### 5. Run Migrations
Railway will automatically run migrations on deploy, or you can run manually:
```bash
railway run python manage.py migrate
railway run python manage.py createsuperuser
```

## Frontend Deployment (Vercel)

### 1. Prepare Vercel Account
1. Sign up at [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Install Vercel CLI: `npm install -g vercel`

### 2. Deploy Frontend
1. In Vercel dashboard, click "New Project"
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Vercel will auto-detect Next.js and deploy

### 3. Configure Environment Variables
In Vercel dashboard, go to Project Settings > Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-railway-app.railway.app
```

### 4. Configure Domain (Optional)
1. In Vercel dashboard, go to Project Settings > Domains
2. Add your custom domain
3. Update CORS settings in Railway backend

## Custom Domain Setup

### Backend (Railway)
1. In Railway project settings, add custom domain
2. Update `ALLOWED_HOSTS` environment variable

### Frontend (Vercel)
1. In Vercel project settings, add custom domain
2. Update `NEXT_PUBLIC_API_URL` if needed
3. Update CORS settings in backend

## Post-Deployment Steps

### 1. Create Superuser
```bash
railway run python manage.py createsuperuser
```

### 2. Configure Django Admin
- Access admin at `https://your-backend-domain.railway.app/admin/`
- Create test articles to verify everything works

### 3. Test API Endpoints
- `GET /api/articles/` - List articles
- `GET /admin/` - Django admin interface

### 4. Setup Stripe (When Ready)
1. Get Stripe API keys from dashboard
2. Add webhook endpoint: `https://your-backend-domain.railway.app/api/stripe/webhook/`
3. Update environment variables in Railway

## Monitoring & Maintenance

### Railway (Backend)
- View logs in Railway dashboard
- Monitor database usage
- Set up alerts for errors

### Vercel (Frontend)
- Monitor performance in Vercel Analytics
- Check build logs for any issues
- Set up custom error pages if needed

## Scaling Considerations

### Database
- Railway PostgreSQL auto-scales
- Monitor connection limits
- Consider read replicas for high traffic

### Backend
- Railway auto-scales based on usage
- Monitor memory and CPU usage
- Consider Redis for caching

### Frontend
- Vercel edge network handles scaling automatically
- Optimize images with Next.js Image component
- Consider implementing ISR for article pages

## Backup Strategy

### Database
- Railway provides automatic backups
- Consider additional backup solutions for critical data

### Media Files
- Consider AWS S3 for production media storage
- Update Django settings to use django-storages

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Set DEBUG=False in production
- [ ] Configure proper ALLOWED_HOSTS
- [ ] Set up HTTPS (handled by Railway/Vercel)
- [ ] Configure CORS properly
- [ ] Set up proper email backend
- [ ] Configure Stripe webhook secrets
- [ ] Regular security updates

## Cost Estimation

### Railway (Backend + Database)
- Starter: $5/month
- Hobby: $10/month  
- Pro: $20/month

### Vercel (Frontend)
- Hobby: Free (limited bandwidth)
- Pro: $20/month per team member

### Total Estimated Cost
- Development: $0-5/month
- Small production: $10-20/month
- Growing site: $30-50/month

## Troubleshooting

### Common Issues
1. **CORS errors**: Check CORS_ALLOWED_ORIGINS settings
2. **Static files not loading**: Ensure collectstatic runs in deployment
3. **Database connection**: Verify DATABASE_URL is set correctly
4. **Frontend API calls failing**: Check NEXT_PUBLIC_API_URL

### Debugging
```bash
# Railway logs
railway logs

# Local development
cd backend && python manage.py runserver
cd frontend && npm run dev
```

## Development Workflow

1. Make changes locally
2. Test with both servers running
3. Push to GitHub
4. Railway and Vercel auto-deploy from main branch
5. Verify changes in production

This deployment setup provides a robust, scalable foundation for the Digno news platform with automatic deployments and managed infrastructure.