# TodoApp - Deployment Guide

Complete guide for deploying TodoApp to production.

## Prerequisites

- Node.js 16+
- PostgreSQL 13+
- npm or yarn
- Git
- Linux/Unix server (Ubuntu 20.04+ recommended)
- SSL certificate
- Domain name

## Environment Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. PostgreSQL Configuration

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo sudo -u postgres psql

# In psql:
CREATE DATABASE todo_app;
CREATE USER todo_user WITH PASSWORD 'strong_password_here';
ALTER ROLE todo_user SET client_encoding TO 'utf8';
ALTER ROLE todo_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE todo_user SET default_transaction_deferrable TO on;
ALTER ROLE todo_user SET default_transaction_read_committed TO on;
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;
\q
```

### 3. Application Setup

```bash
# Clone repository
git clone https://github.com/yourusername/projects-testing.git
cd projects-testing

# Install dependencies
npm install
npm install --workspace=packages/backend
npm install --workspace=packages/frontend

# Build frontend
npm run build --workspace=packages/frontend

# Run migrations
cd packages/backend
npm run db:migrate
cd ../..
```

### 4. Environment Configuration

Create `.env` files for both backend and frontend:

**Backend (`packages/backend/.env`):**
```
DATABASE_URL=postgresql://todo_user:strong_password_here@localhost:5432/todo_app
JWT_SECRET=generate-a-random-secret-key-min-32-chars
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=info
```

**Frontend (`.env` in frontend root or configure in build):**
```
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

### 5. Nginx Configuration

Create `/etc/nginx/sites-available/todoapp`:

```nginx
# API upstream
upstream api_backend {
    server localhost:3001;
    keepalive 64;
}

# HTTP redirect to HTTPS
server {
    listen 80;
    server_name yourdomain.com api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Frontend
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /var/www/todoapp/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Cache static assets
    location ~* ^.+\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # API rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=200 nodelay;

    # CORS headers
    add_header 'Access-Control-Allow-Origin' 'https://yourdomain.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization' always;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/todoapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com
```

### 7. PM2 Setup

Create `ecosystem.config.js` in project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'todoapp-api',
      script: './packages/backend/dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
```

### 8. Start Application

```bash
# Build backend
npm run build --workspace=packages/backend

# Build frontend
npm run build --workspace=packages/frontend

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# View logs
pm2 logs todoapp-api
```

### 9. Database Backups

Create daily backup script `/home/deploy/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/todoapp"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
pg_dump -U todo_user -h localhost todo_app | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

```bash
chmod +x /home/deploy/backup.sh
# Add to crontab: 0 2 * * * /home/deploy/backup.sh
```

### 10. Monitoring & Alerts

Install monitoring tools:
```bash
sudo apt install -y htop iotop nethogs
pm2 install pm2-auto-pull
pm2 install pm2-logrotate
```

### 11. Security Hardening

```bash
# Fail2Ban for brute force protection
sudo apt install -y fail2ban

# UFW Firewall
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Keep system updated
sudo apt autoremove -y
sudo apt autoclean -y
```

## Post-Deployment Checklist

- [ ] Database migrations completed successfully
- [ ] SSL certificate installed and working
- [ ] Nginx proxy configured and tested
- [ ] PM2 processes running and monitored
- [ ] Backup system operational
- [ ] Health check endpoint responding
- [ ] Frontend builds and loads correctly
- [ ] API endpoints accessible and authenticated
- [ ] Logs are being collected properly
- [ ] Firewall configured appropriately
- [ ] Domain DNS pointing to server
- [ ] Rate limiting working
- [ ] CORS properly configured
- [ ] Database performance monitored

## Scaling Considerations

For high traffic:
1. **Horizontal Scaling:**
   - Run multiple backend instances with PM2 cluster mode
   - Use load balancer (Nginx, HAProxy)
   - Database read replicas for analytics

2. **Caching:**
   - Redis for session storage
   - CDN for static assets
   - Query result caching

3. **Database Optimization:**
   - Index frequently queried columns
   - Connection pooling (PgBouncer)
   - Partition large tables

4. **Monitoring:**
   - Application Performance Monitoring (New Relic, DataDog)
   - Error tracking (Sentry)
   - Log aggregation (ELK stack)

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql -U todo_user -h localhost -d todo_app

# Check permissions
sudo -u postgres psql -c "SELECT * FROM pg_roles WHERE rolname='todo_user';"
```

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001
# Kill process
kill -9 <PID>
```

### Nginx Errors
```bash
# Check config
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### PM2 Issues
```bash
# Restart all processes
pm2 restart all

# Monitor processes
pm2 monit

# Clear logs
pm2 flush
```

## Upgrade Procedure

```bash
# 1. Backup database
./backup.sh

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
npm install

# 4. Run migrations
npm run db:migrate --workspace=packages/backend

# 5. Build
npm run build

# 6. Restart application
pm2 restart all

# 7. Verify
curl https://api.yourdomain.com/health
```

## Support & Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Nginx Docs: https://nginx.org/en/docs/
- PM2 Docs: https://pm2.keymetrics.io/docs/
- Let's Encrypt: https://letsencrypt.org/
