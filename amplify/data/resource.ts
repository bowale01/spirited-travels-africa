import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== SPIRITED TRAVELS AFRICA - TRAVEL COMPANION APP =====================
Schema for Africa-focused travel companion app where users can connect
based on shared travel destinations and interests.
=========================================================================*/
const schema = a.schema({
  // User Profile with travel preferences and interests
  UserProfile: a
    .model({
      userId: a.string().required(),
      username: a.string().required(),
      email: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      bio: a.string(),
      profilePicture: a.string(), // S3 URL
      dateOfBirth: a.date(),
      country: a.string(),
      city: a.string(),
      languages: a.string().array(), // ["English", "French", "Swahili"]
      interests: a.string().array(), // ["Wildlife", "Culture", "Adventure", "Food"]
      travelStyle: a.enum(['Budget', 'Luxury', 'Backpacker', 'Cultural', 'Adventure']),
      isVerified: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      // Relations
      trips: a.hasMany('Trip', 'userId'),
      sentConnections: a.hasMany('Connection', 'fromUserId'),
      receivedConnections: a.hasMany('Connection', 'toUserId'),
      sentMessages: a.hasMany('Message', 'senderId'),
      receivedMessages: a.hasMany('Message', 'receiverId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Trip plans for destinations in Africa
  Trip: a
    .model({
      userId: a.string().required(),
      title: a.string().required(),
      description: a.string(),
      country: a.string().required(), // African country
      city: a.string(),
      region: a.string(), // e.g., "East Africa", "West Africa"
      startDate: a.date().required(),
      endDate: a.date().required(),
      budget: a.float(),
      currency: a.string().default('USD'),
      groupSize: a.integer().default(1),
      tripType: a.enum(['Solo', 'Couple', 'Group', 'Family']),
      activities: a.string().array(), // ["Safari", "Beach", "Mountain Climbing", "Cultural Tours"]
      accommodation: a.enum(['Budget', 'Mid-range', 'Luxury', 'Hostel', 'Camping']),
      transportation: a.string().array(), // ["Flight", "Bus", "Car Rental", "Train"]
      isPublic: a.boolean().default(true),
      status: a.enum(['Planning', 'Active', 'Completed', 'Cancelled']),
      latitude: a.float(),
      longitude: a.float(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      // Relations
      user: a.belongsTo('UserProfile', 'userId'),
      matches: a.hasMany('TripMatch', 'tripId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Connections/Matches between users with similar interests and destinations
  Connection: a
    .model({
      fromUserId: a.string().required(),
      toUserId: a.string().required(),
      status: a.enum(['Pending', 'Accepted', 'Declined', 'Blocked']),
      matchScore: a.float(), // Algorithm-generated compatibility score
      commonInterests: a.string().array(),
      commonDestinations: a.string().array(),
      connectionReason: a.string(), // Why they were matched
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      // Relations
      fromUser: a.belongsTo('UserProfile', 'fromUserId'),
      toUser: a.belongsTo('UserProfile', 'toUserId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.custom(),
    ]),

  // Trip matching system
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
      // Relations
      trip: a.belongsTo('Trip', 'tripId'),
      user: a.belongsTo('UserProfile', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Real-time messaging between connected users
  Message: a
    .model({
      senderId: a.string().required(),
      receiverId: a.string().required(),
      content: a.string().required(),
      messageType: a.enum(['Text', 'Image', 'Location', 'Trip_Invitation']),
      isRead: a.boolean().default(false),
      readAt: a.datetime(),
      tripId: a.string(), // Optional: if message is about a specific trip
      attachmentUrl: a.string(), // S3 URL for images/files
      createdAt: a.datetime(),
      // Relations
      sender: a.belongsTo('UserProfile', 'senderId'),
      receiver: a.belongsTo('UserProfile', 'receiverId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.custom(),
    ]),

  // African destinations and points of interest
  Destination: a
    .model({
      name: a.string().required(),
      country: a.string().required(),
      region: a.string().required(), // East, West, North, South, Central Africa
      city: a.string(),
      description: a.string(),
      category: a.enum(['Safari', 'Beach', 'Mountain', 'Cultural', 'Historical', 'Urban', 'Desert']),
      activities: a.string().array(),
      bestTimeToVisit: a.string().array(), // ["Dec-Mar", "Jun-Sep"]
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

  // Reviews and recommendations for destinations
  Review: a
    .model({
      userId: a.string().required(),
      destinationId: a.string().required(),
      tripId: a.string(),
      rating: a.integer().required(), // 1-5 stars
      title: a.string(),
      content: a.string().required(),
      photos: a.string().array(), // S3 URLs
      travelDate: a.date(),
      travelDuration: a.integer(), // days
      budgetSpent: a.float(),
      wouldRecommend: a.boolean().default(true),
      tips: a.string(),
      isVerified: a.boolean().default(false),
      helpfulCount: a.integer().default(0),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      // Relations
      user: a.belongsTo('UserProfile', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Subscription plans for premium features
  Subscription: a
    .model({
      userId: a.string().required(),
      planType: a.enum(['Free', 'Premium', 'VIP']).required(),
      status: a.enum(['Active', 'Cancelled', 'Expired', 'Suspended']),
      startDate: a.date().required(),
      endDate: a.date(),
      price: a.float(),
      currency: a.string().default('EUR'),
      paymentMethod: a.string(),
      features: a.string().array(), // ["Unlimited_Matches", "Priority_Support", "Advanced_Filters"]
      autoRenew: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      // Relations
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

/*== FRONTEND USAGE ======================================================
Use this in your React Native components:

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

// Example: Create user profile
await client.models.UserProfile.create({
  userId: user.userId,
  username: "traveler123",
  email: "user@example.com",
  interests: ["Safari", "Culture", "Adventure"],
  travelStyle: "Adventure"
});

// Example: Search for trips to Kenya
const kenyaTrips = await client.models.Trip.list({
  filter: { country: { eq: "Kenya" } }
});

// Example: Find travel matches
const matches = await client.models.TripMatch.list({
  filter: { userId: { eq: currentUserId } }
});
=========================================================================*/
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
