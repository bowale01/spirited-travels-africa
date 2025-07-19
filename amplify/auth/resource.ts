import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure authentication for Spirited Travels Africa
 * Supports email/password login with social providers for easy onboarding
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcome to Spirited Travels Africa!',
      verificationEmailBody: (createCode) =>
        `Welcome to Spirited Travels Africa! Your verification code is ${createCode()}. Start exploring Africa with like-minded travelers!`,
    },
    // TODO: Add social providers later
    // externalProviders: {
    //   google: {
    //     clientId: 'your-google-client-id',
    //     clientSecret: 'your-google-client-secret',
    //   },
    //   loginWithAmazon: {
    //     clientId: 'your-amazon-client-id',
    //     clientSecret: 'your-amazon-client-secret',
    //   },
    // },
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    givenName: {
      required: true,
      mutable: true,
    },
    familyName: {
      required: true,
      mutable: true,
    },
    preferredUsername: {
      required: false,
      mutable: true,
    },
    // Custom attributes for travel preferences
    'custom:country': {
      dataType: 'String',
      mutable: true,
    },
    'custom:interests': {
      dataType: 'String',
      mutable: true,
    },
    'custom:travel_style': {
      dataType: 'String',
      mutable: true,
    },
  },
  groups: ['admin', 'premium_users', 'verified_travelers'],
});
