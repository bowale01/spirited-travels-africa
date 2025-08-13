# PowerShell script to create store-ready builds

Write-Host "🚀 Building Spirited Travels Africa for App Stores..." -ForegroundColor Green

# Build for Android (APK for sideloading, then we'll guide for Play Store)
Write-Host "📱 Building Android version..." -ForegroundColor Cyan
npx expo export --platform android --output-dir ./store-builds/android

# Build for iOS 
Write-Host "🍎 Building iOS version..." -ForegroundColor Cyan  
npx expo export --platform ios --output-dir ./store-builds/ios

# Create metadata files
Write-Host "📝 Creating store metadata..." -ForegroundColor Yellow

# Android metadata
@"
{
  "name": "Spirited Travels Africa",
  "version": "1.0.0",
  "packageName": "com.spiritedtravels.africa",
  "description": "Discover the beauty of Africa with our travel companion app",
  "category": "Travel & Local",
  "contentRating": "Everyone",
  "features": [
    "Explore African destinations",
    "Beautiful sunset themes", 
    "Travel planning tools",
    "Cultural insights"
  ]
}
"@ | Out-File -FilePath "./store-builds/android-metadata.json" -Encoding UTF8

# iOS metadata  
@"
{
  "name": "Spirited Travels Africa",
  "version": "1.0.0", 
  "bundleId": "com.spiritedtravels.africa",
  "description": "Discover the beauty of Africa with our travel companion app",
  "category": "Travel",
  "contentRating": "4+",
  "features": [
    "Explore African destinations",
    "Beautiful sunset themes",
    "Travel planning tools", 
    "Cultural insights"
  ]
}
"@ | Out-File -FilePath "./store-builds/ios-metadata.json" -Encoding UTF8

Write-Host "✅ Store builds completed!" -ForegroundColor Green
Write-Host "📁 Files are in ./store-builds/" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next Steps for Store Publication:" -ForegroundColor Yellow
Write-Host "1. For Android: Use these files with Android Studio to create APK/AAB"
Write-Host "2. For iOS: Use these files with Xcode to create IPA" 
Write-Host "3. Upload to respective stores"
