# AWS Security Best Practices for Spirited Travels Africa

## Current Security Risks ⚠️
Using full access policies (like AWSCloudFormationFullAccess) creates these risks:
- Unauthorized users could delete your entire infrastructure
- Someone could create expensive resources and drain your AWS budget
- Access to sensitive data in other AWS services
- Ability to modify billing and create new users

## Recommended Security Approach 🔒

### 1. Use Ultra-Minimal Permissions
- File: `amplify-ultra-minimal-policy.json`
- Only allows specific Amplify deployment actions
- Restricts to us-east-1 region only
- No access to unrelated AWS services

### 2. Enable MFA (Multi-Factor Authentication)
```bash
# In AWS Console → IAM → Users → spirited_travel_Africa
# Security credentials → Assign MFA device
```

### 3. Create Deployment-Only User
```bash
# Create a separate user just for Amplify deployment
aws iam create-user --user-name amplify-deploy-only
aws iam attach-user-policy --user-name amplify-deploy-only --policy-arn arn:aws:iam::743508003148:policy/AmplifyUltraMinimalPolicy
```

### 4. Use Temporary Credentials
```bash
# Option A: AWS SSO (Single Sign-On)
# Option B: AssumeRole with time limits
# Option C: Remove permissions after deployment
```

### 5. Monitor AWS Usage
```bash
# Set up billing alerts
aws budgets create-budget --account-id 743508003148 --budget file://budget-alert.json
```

### 6. Regular Security Audit
- Review IAM policies monthly
- Check CloudTrail logs for unusual activity
- Remove unused permissions immediately

## Implementation Steps

### Step 1: Create Ultra-Minimal Policy
1. AWS Console → IAM → Policies → Create Policy
2. JSON tab → Paste contents of `amplify-ultra-minimal-policy.json`
3. Name: "AmplifyUltraMinimalPolicy"

### Step 2: Apply to Your User
1. IAM → Users → spirited_travel_Africa
2. Remove any full access policies
3. Attach "AmplifyUltraMinimalPolicy"

### Step 3: Test Deployment
```bash
npx @aws-amplify/backend-cli sandbox --dir-to-watch amplify
```

### Step 4: If It Works, You're Secure!
- Your user can only deploy Amplify resources
- No access to billing, other services, or deletion of unrelated resources
- Limited to us-east-1 region

## What This Prevents
- ❌ Creating expensive EC2 instances
- ❌ Accessing other AWS services
- ❌ Modifying billing settings
- ❌ Creating new users
- ❌ Deleting your S3 bucket (spirited-travels-africa-mobile-app)
- ❌ Working in other AWS regions

## What This Allows
- ✅ Deploy Amplify authentication
- ✅ Create DynamoDB tables for your app
- ✅ Set up Lambda functions for your API
- ✅ Create Cognito user pools
- ✅ Deploy your travel app backend

## Emergency Access
If you need broader permissions later:
1. Temporarily attach additional policies
2. Complete the task
3. Remove the extra permissions immediately
