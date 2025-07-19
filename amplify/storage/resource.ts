import { defineStorage } from '@aws-amplify/backend';

/**
 * Define storage for Spirited Travels Africa
 * Handles profile pictures, trip photos, and destination images
 */
export const storage = defineStorage({
  name: 'spirited-travels-storage',
  access: (allow) => ({
    'profile-pictures/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
    'trip-photos/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
    'destination-images/*': [
      allow.groups(['admin']).to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
    'verification-documents/*': [
      allow.entity('identity').to(['read', 'write']),
      allow.groups(['admin']).to(['read']),
    ],
    'chat-attachments/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
    ],
  }),
});
