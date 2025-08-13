# Spirited Travels Africa - Mobile Build Script for AWS
# This script builds both Android and iOS versions of your travel app

Write-Host "🌍 Building Spirited Travels Africa Mobile App..." -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build for Android using Expo
Write-Host "🤖 Building Android APK..." -ForegroundColor Cyan
npx expo export --platform android --output-dir ./dist/android

# Build for iOS using Expo  
Write-Host "🍎 Building iOS Archive..." -ForegroundColor Magenta
npx expo export --platform ios --output-dir ./dist/ios

# Create distribution folder
New-Item -ItemType Directory -Force -Path "dist/mobile"

# Copy builds to mobile folder
if (Test-Path "dist/android") { Copy-Item -Path "dist/android/*" -Destination "dist/mobile/" -Recurse -Force }
if (Test-Path "dist/ios") { Copy-Item -Path "dist/ios/*" -Destination "dist/mobile/" -Recurse -Force }

Write-Host "✅ Mobile builds completed!" -ForegroundColor Green
Write-Host "📱 Android build: dist/mobile/" -ForegroundColor Cyan  
Write-Host "🍎 iOS build: dist/mobile/" -ForegroundColor Magenta

# Upload to AWS S3
Write-Host "☁️ Uploading to AWS S3..." -ForegroundColor Blue
aws s3 sync dist/mobile/ s3://spirited-travels-africa-mobile-app/builds/ --recursive

Write-Host "🎉 Deployment to AWS completed!" -ForegroundColor Green
Write-Host "📦 Download links:" -ForegroundColor White
Write-Host "Android: https://spirited-travels-africa-mobile-app.s3.amazonaws.com/builds/" -ForegroundColor Cyan
Write-Host "iOS: https://spirited-travels-africa-mobile-app.s3.amazonaws.com/builds/" -ForegroundColor Magenta
