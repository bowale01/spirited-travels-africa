#!/bin/bash

# Spirited Travels Africa - Mobile Build Script for AWS
# This script builds both Android and iOS versions of your travel app

echo "🌍 Building Spirited Travels Africa Mobile App..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for Android (APK)
echo "🤖 Building Android APK..."
npx expo build:android --type apk --non-interactive

# Build for iOS (IPA) 
echo "🍎 Building iOS IPA..."
npx expo build:ios --type archive --non-interactive

# Create distribution folder
mkdir -p dist/mobile
mv *.apk dist/mobile/ 2>/dev/null || true
mv *.ipa dist/mobile/ 2>/dev/null || true

echo "✅ Mobile builds completed!"
echo "📱 Android APK: dist/mobile/*.apk"
echo "🍎 iOS IPA: dist/mobile/*.ipa"

# Upload to AWS S3
echo "☁️ Uploading to AWS S3..."
aws s3 sync dist/mobile/ s3://spirited-travels-africa-mobile-app/builds/ --recursive

echo "🎉 Deployment to AWS completed!"
echo "📦 Download links:"
echo "Android: https://spirited-travels-africa-mobile-app.s3.amazonaws.com/builds/"
echo "iOS: https://spirited-travels-africa-mobile-app.s3.amazonaws.com/builds/"
