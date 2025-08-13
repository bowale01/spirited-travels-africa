#!/usr/bin/env node

/**
 * Spirited Travels Africa - Development Utilities
 * Quick commands for common development tasks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DevUtils {
  constructor() {
    this.projectRoot = process.cwd();
  }

  // Check backend status
  checkBackend() {
    console.log('🔍 Checking AWS Backend Status...');
    try {
      const outputs = JSON.parse(fs.readFileSync('./amplify_outputs.json', 'utf8'));
      console.log('✅ Cognito User Pool:', outputs.auth?.user_pool_id || 'Not found');
      console.log('✅ GraphQL Endpoint:', outputs.data?.url || 'Not found');
      console.log('✅ S3 Bucket:', outputs.storage?.bucket_name || 'Not found');
      return true;
    } catch (error) {
      console.log('❌ Backend not deployed or amplify_outputs.json missing');
      return false;
    }
  }

  // Reset local development
  resetDev() {
    console.log('🔄 Resetting development environment...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      execSync('npx expo install --fix', { stdio: 'inherit' });
      console.log('✅ Development environment reset complete');
    } catch (error) {
      console.log('❌ Reset failed:', error.message);
    }
  }

  // Build for testing
  buildTest() {
    console.log('🏗️ Building test version...');
    try {
      execSync('npx expo export --platform all --output-dir ./builds/test', { stdio: 'inherit' });
      console.log('✅ Test build complete in ./builds/test');
    } catch (error) {
      console.log('❌ Build failed:', error.message);
    }
  }

  // Deploy backend changes
  deployBackend() {
    console.log('🚀 Deploying backend changes...');
    try {
      execSync('npx ampx sandbox deploy', { stdio: 'inherit' });
      console.log('✅ Backend deployment complete');
    } catch (error) {
      console.log('❌ Deployment failed:', error.message);
    }
  }

  // Generate sample data
  generateSampleData() {
    console.log('📝 Generating sample data...');
    // This would connect to your GraphQL API and create sample users, trips, etc.
    const sampleData = {
      users: 10,
      trips: 25,
      destinations: 50,
      connections: 30
    };
    console.log('✅ Sample data structure ready:', sampleData);
    console.log('💡 Implement GraphQL mutations to create actual data');
  }

  // Show help
  showHelp() {
    console.log(`
🌍 Spirited Travels Africa - Development Tools

Available Commands:
  node dev-utils.js check     - Check backend deployment status
  node dev-utils.js reset     - Reset development environment
  node dev-utils.js build     - Build test version
  node dev-utils.js deploy    - Deploy backend changes
  node dev-utils.js sample    - Generate sample data structure
  node dev-utils.js help      - Show this help

Quick Development Workflow:
1. npm start                 - Start React Native dev server
2. node dev-utils.js check   - Verify backend is working
3. Test features in simulator/device
4. node dev-utils.js deploy  - Deploy any backend changes
5. node dev-utils.js build   - Build for distribution

Current Project Status:
✅ React Native app created
✅ AWS backend deployed
✅ Authentication system integrated
🔄 Feature development in progress
`);
  }
}

// Command line interface
const utils = new DevUtils();
const command = process.argv[2];

switch (command) {
  case 'check':
    utils.checkBackend();
    break;
  case 'reset':
    utils.resetDev();
    break;
  case 'build':
    utils.buildTest();
    break;
  case 'deploy':
    utils.deployBackend();
    break;
  case 'sample':
    utils.generateSampleData();
    break;
  case 'help':
  default:
    utils.showHelp();
    break;
}
