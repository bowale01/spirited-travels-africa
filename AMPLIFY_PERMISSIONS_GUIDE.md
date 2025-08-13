# Fix Amplify Gen 2 Deployment Permissions - AWS Console Steps

## Problem
Your AWS user lacks SSM (Systems Manager) permissions needed for AWS CDK bootstrap operations that Amplify Gen 2 requires.

## Error Seen
```
[SSMCredentialsError] AccessDeniedException: User: arn:aws:iam::743508003148:user/spirited_travel_Africa is not authorized to perform: ssm:GetParameter on resource: arn:aws:ssm:us-east-1:743508003148:parameter/cdk-bootstrap/hnb659fds/version
```

## Quick Fix Options

### Option 1: Minimal Permissions (Most Secure)
1. Go to AWS Console → IAM → Policies → Create Policy
2. Copy content from `amplify-minimal-policy.json` 
3. Create policy named "AmplifyMinimalDeploymentPolicy"
4. Go to Users → spirited_travel_Africa → Attach this policy

### Option 2: AWS Managed Policies (Easier but broader)
1. Go to AWS Console → IAM → Users → spirited_travel_Africa
2. Click "Add permissions" → "Attach policies directly"
3. Search for and attach these AWS managed policies:
   - `AWSCloudFormationFullAccess`
   - `AmazonSSMFullAccess` 
   - `IAMFullAccess` (if you need to create roles)

**⚠️ Security Note**: Option 2 gives broader permissions than needed. Option 1 is more secure.

### Option 2: Use AWS CLI with Admin User
If you have access to an admin user or role:
```bash
aws iam attach-user-policy --user-name spirited_travel_Africa --policy-arn arn:aws:iam::aws:policy/AWSCloudFormationFullAccess
aws iam attach-user-policy --user-name spirited_travel_Africa --policy-arn arn:aws:iam::aws:policy/AmazonSSMFullAccess
aws iam attach-user-policy --user-name spirited_travel_Africa --policy-arn arn:aws:iam::aws:policy/IAMFullAccess
```

### Option 3: Bootstrap CDK First
Sometimes just bootstrapping CDK can help:
```bash
npx cdk bootstrap aws://743508003148/us-east-1
```

## After Fixing Permissions
1. Test SSM access: `aws ssm get-parameter --name "/cdk-bootstrap/hnb659fds/version" --region us-east-1`
2. Retry Amplify deployment: `npx @aws-amplify/backend-cli sandbox --dir-to-watch amplify`

## Files Created
- `amplify-deployment-policy.json` - Custom policy with exact permissions needed
- This guide for manual steps

Choose the option that works best with your AWS account setup!
