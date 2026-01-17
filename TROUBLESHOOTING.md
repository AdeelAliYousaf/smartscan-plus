# 🔧 SmartScan+ Admin Portal - Troubleshooting Guide

## Common Issues & Solutions

---

## ❌ Issue: "Docker is not installed"

**Error Message:**
```
'docker' is not recognized as an internal or external command
```

**Solution:**
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and restart your computer
3. Verify installation: `docker --version`
4. Try starting services again

---

## ❌ Issue: "Port 3000 already in use"

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

### Option 1: Use Different Port
Edit `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change to 3001
```
Then access: http://localhost:3001

### Option 2: Kill Process on Port 3000

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

---

## ❌ Issue: "Cannot connect to database"

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

### Step 1: Check Services Running
```bash
docker-compose ps
```

Should show:
```
NAME                 STATUS
smartscan_postgres   Up (healthy)
smartscan_admin_web  Up
```

### Step 2: If PostgreSQL Not Running
```bash
docker-compose restart postgres
# Wait 10 seconds for startup
docker-compose logs postgres
```

### Step 3: Check Database Connection
```bash
docker exec -it smartscan_postgres psql -U admin -d smartscan_db
```

If this works, database is fine. Problem might be in application connection string.

### Step 4: Verify DATABASE_URL
Check `.env.local`:
```
DATABASE_URL=postgresql://admin:smartscan_secure_password@postgres:5432/smartscan_db
```

Should match your configuration. Note: Use `postgres` (container name) not `localhost` for host.

---

## ❌ Issue: "Login not working"

**Problem:** Login button doesn't work, credentials don't authenticate

**Solution:**

### Step 1: Verify Credentials
Default credentials:
- **Email**: admin@smartscan.com
- **Password**: smartscan123

Make sure they're exactly correct (case-sensitive for email).

### Step 2: Check Browser Console
1. Open Developer Tools (F12)
2. Go to "Console" tab
3. Look for errors
4. Check "Network" tab for API responses

### Step 3: Check Application Logs
```bash
docker-compose logs admin_web
```

Look for error messages related to authentication.

### Step 4: Verify Database
```bash
docker exec -it smartscan_postgres psql -U admin -d smartscan_db
SELECT * FROM admins;
```

Should show one row with admin@smartscan.com

### Step 5: Test API Directly
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartscan.com","password":"smartscan123"}'
```

Should return a token.

---

## ❌ Issue: "Application won't start"

**Error Message:**
```
Container exited with code 1
```

**Solution:**

### Step 1: Check Logs
```bash
docker-compose logs admin_web
```

### Step 2: Common Causes

**Missing dependencies:**
```bash
docker-compose build --no-cache
docker-compose up -d
```

**Port conflict:**
Change port in docker-compose.yml

**Environment variables missing:**
Copy .env.example to .env.local
```bash
cp .env.example .env.local
```

### Step 3: Full Reset
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## ❌ Issue: "Cannot access http://localhost:3000"

**Problem:** Page won't load, connection refused

**Solution:**

### Step 1: Verify Services Running
```bash
docker-compose ps
```

If not running:
```bash
docker-compose up -d
```

### Step 2: Check Port is Correct
Default: **http://localhost:3000**

If changed in docker-compose.yml, use that port instead.

### Step 3: Wait for Startup
Services take 10-15 seconds to fully start:
```bash
docker-compose logs -f
# Wait until you see "Ready in Xs"
```

### Step 4: Try Different Browser
- Chrome
- Firefox
- Edge
- Safari

Try one without extensions/cache.

### Step 5: Clear Browser Cache
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Clear cookies and cache
- Try incognito/private window

---

## ❌ Issue: "Database tables missing"

**Problem:** API returns error about missing table

**Solution:**

### Step 1: Verify Tables Exist
```bash
docker exec -it smartscan_postgres psql -U admin -d smartscan_db
\dt  # List all tables
```

Should show:
- admins
- sessions
- audit_logs

### Step 2: If Tables Missing
Database didn't initialize properly.

### Solution:
```bash
# Stop everything
docker-compose down -v

# Start again (forces reinitialization)
docker-compose up -d

# Verify tables
docker exec -it smartscan_postgres psql -U admin -d smartscan_db
\dt
```

### Step 3: Manual Initialization
```bash
docker exec -i smartscan_postgres psql -U admin -d smartscan_db < init.sql
```

---

## ❌ Issue: "Login page looks broken"

**Problem:** Layout is messed up, styles not working

**Solution:**

### Step 1: Hard Refresh Browser
- Windows/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

### Step 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click reload button
3. Click "Empty cache and hard refresh"

### Step 3: Check Tailwind CSS
Sometimes CSS doesn't load properly:
```bash
docker-compose restart admin_web
```

### Step 4: Full Rebuild
```bash
docker-compose build --no-cache
docker-compose up -d
```

---

## ❌ Issue: "Containers won't stop"

**Problem:** `docker-compose stop` hangs

**Solution:**

### Forceful Stop
```bash
docker-compose kill
```

Then remove:
```bash
docker-compose down
```

### Alternative
```bash
docker stop smartscan_postgres smartscan_admin_web
```

---

## ❌ Issue: "Storage full / disk space"

**Problem:** Docker can't start containers

**Solution:**

### Check Disk Space
```bash
df -h  # Mac/Linux
```

### Clean Up Docker
```bash
docker system prune -f
docker volume prune -f
```

### Remove Old Data
```bash
docker-compose down -v
```

This deletes database data. Backup first if needed!

---

## ❌ Issue: "Dashboard shows no data"

**Problem:** Stats show 0 or mock data doesn't appear

**Solution:**

### This is Normal
Dashboard currently shows **mock data** for demonstration. 

### To Connect Real Data:
1. Modify `app/dashboard/page.tsx`
2. Add API calls to fetch real data:
```typescript
const response = await fetch('/api/stats');
const data = await response.json();
setStats(data);
```

3. Create API endpoint `/api/stats` to query database

---

## ❌ Issue: "Password requirements"

**Problem:** Password won't work even though it looks correct

**Solution:**

**Default credentials are case-sensitive:**
- Email: `admin@smartscan.com` (exact)
- Password: `smartscan123` (exact)

Make sure:
- No extra spaces
- Correct capitalization
- No typos

---

## ⚠️ Issue: "Need to change admin password"

**Solution:**

Access database:
```bash
docker exec -it smartscan_postgres psql -U admin -d smartscan_db
```

Update password (current: bcrypt hash):
```sql
UPDATE admins SET password_hash = 'new_bcrypt_hash' WHERE email = 'admin@smartscan.com';
```

For temporary password change, ask developer to generate bcrypt hash.

---

## ❌ Issue: "Middleware not protecting routes"

**Problem:** Can access `/dashboard` without login

**Solution:**

### Check middleware.ts
Ensure `middleware.ts` exists in root:
```bash
ls -la middleware.ts
```

### Verify Public Routes List
Routes without token requirement in `middleware.ts`:
- /auth/login
- /auth/forgot-password
- /api/auth/login

Other routes need token.

### Test Token
1. Login and get token
2. Open DevTools → Application → localStorage
3. Check `authToken` exists
4. Logout should clear it

---

## 🆘 "Still having issues?"

### 1. Check All Logs
```bash
docker-compose logs -f
```

### 2. Verify Configuration
```bash
cat .env.local
docker-compose ps
```

### 3. Test Components
```bash
# Test database
docker exec -it smartscan_postgres psql -U admin -d smartscan_db

# Test API
curl -X GET http://localhost:3000/api

# Test app
curl -X GET http://localhost:3000
```

### 4. Nuclear Option (Last Resort)
```bash
# Remove everything and start fresh
docker-compose down -v
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### 5. Get Help
Read comprehensive guides:
- QUICKSTART.md
- DOCKER_SETUP.md
- ARCHITECTURE.md

---

## 📞 Quick Commands Reference

```bash
# Start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose stop

# Reset
docker-compose down -v

# Status
docker-compose ps

# Database
docker exec -it smartscan_postgres psql -U admin -d smartscan_db

# Rebuild
docker-compose build --no-cache && docker-compose up -d

# Clean up
docker system prune -f
```

---

## 🎯 Verification Checklist

After troubleshooting, verify:

- [ ] `docker-compose ps` shows 2 services "Up"
- [ ] http://localhost:3000 opens
- [ ] Login page displays correctly
- [ ] Database contains admins table
- [ ] Can login with admin@smartscan.com / smartscan123
- [ ] Dashboard shows after login
- [ ] No errors in logs: `docker-compose logs`

---

## 📚 Additional Resources

- **Detailed Guide**: DOCKER_SETUP.md
- **Architecture**: ARCHITECTURE.md
- **Quick Start**: QUICKSTART.md
- **Full Index**: INDEX.md

---

**Last Updated**: January 2026  
**Version**: 1.0

**Need help? Check the documentation first! 📚**
