@echo off
echo Building and deploying Sang-Logium to production...
echo.

echo 1. Building application...
call npm run build
if %ERRORLEVEL% neq 0 (
  echo Build failed.
  exit /b %ERRORLEVEL%
)

echo.
echo 2. Deploying to production...
call netlify deploy --prod
if %ERRORLEVEL% neq 0 (
  echo Deployment failed.
  exit /b %ERRORLEVEL%
)

echo.
echo Deployment completed successfully!
echo The application is now live!