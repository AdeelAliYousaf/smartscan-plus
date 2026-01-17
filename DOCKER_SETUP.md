# SmartScan+ Admin Web Application - Docker Setup Guide

## Overview

This guide covers setting up and running the SmartScan+ Admin Web Application with PostgreSQL using Docker and Docker Compose.

## Prerequisites

- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later
- **Git**: For cloning the repository

## Quick Start

### 1. Clone and Navigate to the Project

```bash
cd admin-web-application
```

### 2. Create Environment File

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
DATABASE_URL=postgresql://admin:smartscan_secure_password@postgres:5432/smartscan_db
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
```

### 3. Build and Start Services

```bash
docker-compose up -d
```

This command will:
- Build the Next.js application Docker image
- Start PostgreSQL database container
- Start the Next.js admin application
- Create and initialize the database

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:3000/auth/login
```

**Default Credentials:**
- Email: `admin@smartscan.com`
- Password: `smartscan123`

## Docker Compose Services

### PostgreSQL Database

- **Container Name**: `smartscan_postgres`
- **Port**: 5432 (internal), 5432 (mapped to host)
- **User**: admin
- **Database**: smartscan_db
- **Data Volume**: `postgres_data`

### Next.js Admin Application

- **Container Name**: `smartscan_admin_web`
- **Port**: 3000 (internal), 3000 (mapped to host)
- **Environment**: Production
- **Rebuild on code changes**: Yes (volume mount)

## Useful Docker Commands

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs postgres
docker-compose logs admin_web

# Follow logs in real-time
docker-compose logs -f
```

### Stop Services

```bash
# Stop all containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove containers, volumes, and networks
docker-compose down -v
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart admin_web
docker-compose restart postgres
```

### Access Database

```bash
# Connect to PostgreSQL
docker exec -it smartscan_postgres psql -U admin -d smartscan_db

# Common SQL commands
\dt                          # List all tables
\l                           # List all databases
SELECT * FROM admins;        # View admin users
SELECT * FROM sessions;      # View active sessions
SELECT * FROM audit_logs;    # View audit logs
\q                           # Quit psql
```

### Rebuild Application

```bash
# Rebuild without cache
docker-compose build --no-cache

# Rebuild and start
docker-compose up -d --build
```

### View Running Containers

```bash
docker-compose ps
```

## Database Structure

### Tables Created Automatically

The `init.sql` script creates the following tables:

1. **admins** - Admin user accounts
   - id, email, password_hash, full_name, role, is_active, last_login, created_at, updated_at

2. **sessions** - User session management
   - id, admin_id, token, expires_at, created_at

3. **audit_logs** - Activity tracking
   - id, admin_id, action, details, ip_address, created_at

## Authentication Page Features

The login page includes:

- ✨ Modern, beautiful gradient UI design
- 🔐 Secure password field with show/hide toggle
- 🎯 Form validation
- ⚡ Loading states with spinner
- 🎨 Animated background blobs
- 📱 Fully responsive design
- 🔗 "Forgot Password" link
- ✅ "Remember Me" checkbox
- 🌐 OAuth social login buttons (Google, GitHub)
- ♿ Accessibility features

## Dashboard Features

The admin dashboard includes:

- 📊 Welcome message with user info
- 📈 Key metrics cards (Users, Scans, Accuracy, Sessions)
- 🎨 Color-coded stat cards
- 🚪 Logout functionality
- 📱 Responsive layout

## API Endpoints

### Authentication Routes

```
POST /api/auth/login
- Body: { email: string, password: string }
- Response: { success: boolean, token: string, user: object }

POST /api/auth/logout
- Response: { success: boolean }

GET /api/auth/verify
- Response: { valid: boolean, user: object }
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | postgresql://admin:smartscan_secure_password@postgres:5432/smartscan_db |
| `NODE_ENV` | Node environment | production |
| `NEXT_PUBLIC_API_URL` | Public API URL | http://localhost:3000 |
| `JWT_SECRET` | Secret key for JWT tokens | Change in production |
| `SMTP_HOST` | Email server host | smtp.gmail.com |
| `SMTP_PORT` | Email server port | 587 |

## Security Considerations

### For Development

⚠️ **Important**: The default credentials and password hash in `init.sql` are for development only.

### For Production

1. **Change default credentials**:
   ```sql
   UPDATE admins SET password_hash = 'new_hash' WHERE email = 'admin@smartscan.com';
   ```

2. **Use strong JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Enable HTTPS** with SSL certificates

4. **Use environment-specific .env files**:
   - `.env.development`
   - `.env.staging`
   - `.env.production`

5. **Set up proper PostgreSQL authentication**:
   - Change default password
   - Create separate database users
   - Implement role-based access

6. **Enable database backups**:
   ```bash
   docker exec smartscan_postgres pg_dump -U admin smartscan_db > backup.sql
   ```

7. **Configure firewall rules** to restrict database port access

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose ps

# Verify container logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Use different port in docker-compose.yml
# Change: "3000:3000" to "3001:3000"

# Or kill the process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Build Failures

```bash
# Clear Docker cache and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run development server (without Docker)
npm run dev

# Access at http://localhost:3000
```

### Docker Development

```bash
# Build and start services
docker-compose up -d

# Logs
docker-compose logs -f

# Make code changes (auto-rebuild enabled)
# Changes will reflect immediately

# Stop when done
docker-compose down
```

## Database Migrations

To add new tables or modify schema:

1. Create a new SQL file in the `migrations/` folder:
   ```bash
   mkdir -p migrations
   touch migrations/002_create_new_table.sql
   ```

2. Add your SQL commands

3. Execute:
   ```bash
   docker exec smartscan_postgres psql -U admin -d smartscan_db -f migrations/002_create_new_table.sql
   ```

## Backup and Restore

### Backup Database

```bash
docker exec smartscan_postgres pg_dump -U admin smartscan_db > smartscan_backup.sql
```

### Restore Database

```bash
docker exec -i smartscan_postgres psql -U admin smartscan_db < smartscan_backup.sql
```

## Performance Optimization

### Database Indexes

Indexes are already created for common queries:
- `admins.email`
- `sessions.admin_id` and `sessions.token`
- `audit_logs.admin_id` and `audit_logs.created_at`

### Next.js Optimization

- Static generation enabled
- Image optimization active
- Code splitting automatic
- CSS modules for styling

## Support and Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)

## License

This project is part of SmartScan+ Final Year Project.

---

**Last Updated**: January 2026
