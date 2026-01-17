@echo off
REM SmartScan+ Admin Portal - Docker Quick Start Script for Windows

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   SmartScan+ Admin Portal Launcher
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed
    echo Please install Docker Desktop (includes Docker Compose)
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo.

REM Display menu
:menu
cls
echo ========================================
echo   SmartScan+ Admin Portal Menu
echo ========================================
echo.
echo 1. Start Services (First Time)
echo 2. View Logs
echo 3. Stop Services
echo 4. Restart Services
echo 5. Access Database
echo 6. View Running Services
echo 7. Reset Everything (Remove all data)
echo 8. Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto logs
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto restart
if "%choice%"=="5" goto database
if "%choice%"=="6" goto status
if "%choice%"=="7" goto reset
if "%choice%"=="8" goto exit

echo Invalid choice. Please try again.
timeout /t 2 >nul
goto menu

:start
cls
echo Starting SmartScan+ Admin Portal...
echo.
docker-compose up -d
echo.
echo Services are starting...
echo Waiting 10 seconds for initialization...
timeout /t 10 >nul
echo.
echo [SUCCESS] Services started!
echo.
echo Access the application at:
echo   http://localhost:3000/auth/login
echo.
echo Default credentials:
echo   Email: admin@smartscan.com
echo   Password: smartscan123
echo.
pause
goto menu

:logs
cls
echo Showing live logs (Press Ctrl+C to exit)...
echo.
docker-compose logs -f
goto menu

:stop
cls
echo Stopping services...
docker-compose stop
echo.
echo [SUCCESS] Services stopped!
echo.
pause
goto menu

:restart
cls
echo Restarting services...
docker-compose restart
echo.
echo [SUCCESS] Services restarted!
echo Waiting 5 seconds...
timeout /t 5 >nul
echo.
echo Access at: http://localhost:3000/auth/login
echo.
pause
goto menu

:database
cls
echo Connecting to PostgreSQL...
echo.
docker exec -it smartscan_postgres psql -U admin -d smartscan_db
goto menu

:status
cls
echo Showing running services...
echo.
docker-compose ps
echo.
pause
goto menu

:reset
cls
echo.
echo WARNING: This will delete all data!
set /p confirm="Are you sure? (yes/no): "
if /i "%confirm%"=="yes" (
    echo Removing everything...
    docker-compose down -v
    echo.
    echo [SUCCESS] Everything removed!
    echo Run option 1 to start fresh
) else (
    echo Cancelled.
)
echo.
pause
goto menu

:exit
echo.
echo Goodbye!
exit /b 0
