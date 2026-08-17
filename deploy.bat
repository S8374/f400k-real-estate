@echo off
echo =======================================================
echo     Building and Pushing All Docker Images
echo =======================================================
echo.

echo [1/3] Processing Backend...
cd f4rooqh_Tech_hype1_backend
docker build -t sabbirmridha/farook:backend .
docker push sabbirmridha/farook:backend
cd ..
echo Backend processed successfully!
echo.

echo [2/3] Processing Frontend...
cd f4rooqh_Tech_hype1_frontend
docker build -t sabbirmridha/farook:frontend .
docker push sabbirmridha/farook:frontend
cd ..
echo Frontend processed successfully!
echo.

echo [3/3] Processing Admin...
cd farook-admin
docker build -t sabbirmridha/farook:admin .
docker push sabbirmridha/farook:admin
cd ..
echo Admin processed successfully!
echo.

echo =======================================================
echo All 3 services have been successfully built and pushed!
echo You can now go to Dockploy and hit "Deploy/Restart" 
echo for your services to pull these latest images.
echo =======================================================
pause
