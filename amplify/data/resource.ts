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

  Trip: a
    .model({
      userId: a.string().required(),
      title: a.string().required(),
      description: a.string(),
      country: a.string().required(),
      city: a.string(),
      region: a.string(),
      startDate: a.date().required(),
      endDate: a.date().required(),
      budget: a.float(),
      currency: a.string().default("USD"),
      groupSize: a.integer().default(1),
      tripType: a.enum(['Solo', 'Couple', 'Group', 'Family']),
      activities: a.string().array(),
      accommodation: a.enum(['Budget', 'Midrange', 'Luxury', 'Hostel', 'Camping']),
      transportation: a.string().array(),
      isPublic: a.boolean().default(true),
      status: a.enum(['Planning', 'Active', 'Completed', 'Cancelled']),
      latitude: a.float(),
      longitude: a.float(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  Connection: a
    .model({
      fromUserId: a.string().required(),
      toUserId: a.string().required(),
      status: a.enum(['Pending', 'Accepted', 'Declined', 'Blocked']),
      matchScore: a.float(),
      commonInterests: a.string().array(),
      commonDestinations: a.string().array(),
      connectionReason: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  Message: a
    .model({
      senderId: a.string().required(),
      receiverId: a.string().required(),
      content: a.string().required(),
      messageType: a.enum(['Text', 'Image', 'Location', 'TripInvitation']),
      isRead: a.boolean().default(false),
      readAt: a.datetime(),
      tripId: a.string(),
      attachmentUrl: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  TripMatch: a
    .model({
      userId: a.string().required(),
      matchedUserId: a.string().required(),
      tripId: a.string().required(),
      matchScore: a.float().required(),
      status: a.enum(['Pending', 'Accepted', 'Declined', 'Expired']),
      commonInterests: a.string().array(),
      compatibilityFactors: a.string().array(),
      createdAt: a.datetime().required(),
      expiresAt: a.datetime().required()
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  Destination: a
    .model({
      name: a.string().required(),
      country: a.string().required(),
      region: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      description: a.string(),
      averageRating: a.float().default(0),
      totalReviews: a.integer().default(0),
      categories: a.string().array(),
      bestTimeToVisit: a.string(),
      estimatedCost: a.enum(['Budget', 'Midrange', 'Luxury']),
      popularActivities: a.string().array(),
      weatherInfo: a.string(),
      travelTips: a.string().array(),
      imageUrls: a.string().array(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime()
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  Review: a
    .model({
      userId: a.string().required(),
      destinationId: a.string().required(),
      rating: a.integer().required(),
      title: a.string().required(),
      content: a.string().required(),
      visitDate: a.date(),
      tripType: a.enum(['Solo', 'Couple', 'Family', 'Friends', 'Business']),
      photos: a.string().array(),
      helpfulVotes: a.integer().default(0),
      verified: a.boolean().default(false),
      tags: a.string().array(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime()
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  UserSubscription: a
    .model({
      userId: a.string().required(),
      planType: a.enum(['Free', 'Premium', 'Enterprise']),
      status: a.enum(['Active', 'Cancelled', 'Expired', 'Trial']),
      startDate: a.datetime().required(),
      endDate: a.datetime(),
      features: a.string().array(),
      paymentMethod: a.string(),
      autoRenew: a.boolean().default(true),
      trialUsed: a.boolean().default(false),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime()
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