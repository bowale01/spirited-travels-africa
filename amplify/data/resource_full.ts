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
      trips: a.hasMany('Trip', 'userId'),
      tripMatches: a.hasMany('TripMatch', 'userId'),
      sentConnections: a.hasMany('Connection', 'fromUserId'),
      receivedConnections: a.hasMany('Connection', 'toUserId'),
      sentMessages: a.hasMany('Message', 'senderId'),
      receivedMessages: a.hasMany('Message', 'receiverId'),
      reviews: a.hasMany('Review', 'userId'),
      subscriptions: a.hasMany('Subscription', 'userId'),
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
      accommodation: a.enum(['Budget', 'Mid-range', 'Luxury', 'Hostel', 'Camping']),
      transportation: a.string().array(),
      isPublic: a.boolean().default(true),
      status: a.enum(['Planning', 'Active', 'Completed', 'Cancelled']),
      latitude: a.float(),
      longitude: a.float(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      user: a.belongsTo('UserProfile', 'userId'),
      matches: a.hasMany('TripMatch', 'tripId'),
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
      fromUser: a.belongsTo('UserProfile', 'fromUserId'),
      toUser: a.belongsTo('UserProfile', 'toUserId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.custom(),
    ]),

  TripMatch: a
    .model({
      tripId: a.string().required(),
      matchedTripId: a.string().required(),
      userId: a.string().required(),
      matchedUserId: a.string().required(),
      matchScore: a.float().required(),
      commonActivities: a.string().array(),
      overlappingDates: a.boolean().default(false),
      sameDestination: a.boolean().default(false),
      compatibilityFactors: a.string().array(),
      createdAt: a.datetime(),
      trip: a.belongsTo('Trip', 'tripId'),
      user: a.belongsTo('UserProfile', 'userId'),
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
      messageType: a.enum(['Text', 'Image', 'Location', 'Trip_Invitation']),
      isRead: a.boolean().default(false),
      readAt: a.datetime(),
      tripId: a.string(),
      attachmentUrl: a.string(),
      createdAt: a.datetime(),
      sender: a.belongsTo('UserProfile', 'senderId'),
      receiver: a.belongsTo('UserProfile', 'receiverId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.custom(),
    ]),

  Destination: a
    .model({
      name: a.string().required(),
      country: a.string().required(),
      region: a.string().required(),
      city: a.string(),
      description: a.string(),
      category: a.enum(['Safari', 'Beach', 'Mountain', 'Cultural', 'Historical', 'Urban', 'Desert']),
      activities: a.string().array(),
      bestTimeToVisit: a.string().array(),
      averageBudget: a.float(),
      difficulty: a.enum(['Easy', 'Moderate', 'Challenging', 'Expert']),
      latitude: a.float().required(),
      longitude: a.float().required(),
      imageUrls: a.string().array(),
      rating: a.float().default(0),
      reviewCount: a.integer().default(0),
      isPopular: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.groups(['admin']).to(['create', 'update', 'delete']),
    ]),

  Review: a
    .model({
      userId: a.string().required(),
      destinationId: a.string().required(),
      tripId: a.string(),
      rating: a.integer().required(),
      title: a.string(),
      content: a.string().required(),
      photos: a.string().array(),
      travelDate: a.date(),
      travelDuration: a.integer(),
      budgetSpent: a.float(),
      wouldRecommend: a.boolean().default(true),
      tips: a.string(),
      isVerified: a.boolean().default(false),
      helpfulCount: a.integer().default(0),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      user: a.belongsTo('UserProfile', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  Subscription: a
    .model({
      userId: a.string().required(),
      planType: a.enum(['Free', 'Premium', 'VIP']),
      status: a.enum(['Active', 'Cancelled', 'Expired', 'Suspended']),
      startDate: a.date().required(),
      endDate: a.date(),
      price: a.float(),
      currency: a.string().default("USD"),
      paymentMethod: a.string(),
      features: a.string().array(),
      autoRenew: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      user: a.belongsTo('UserProfile', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
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
