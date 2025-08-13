import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  UserProfile: a
    .model({
      userId: a.string().required(),
      username: a.string().required(),
      email: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      bio: a.string(),
      profilePicture: a.string(),
      dateOfBirth: a.date(),
      country: a.string(),
      city: a.string(),
      languages: a.string().array(),
      interests: a.string().array(),
      travelStyle: a.enum(['Budget', 'Luxury', 'Backpacker', 'Cultural', 'Adventure']),
      isVerified: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
