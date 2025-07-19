import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * Spirited Travels Africa Backend Configuration
 * Complete AWS Amplify Gen 2 setup for Africa travel companion app
 * @see https://docs.amplify.aws/react/build-a-backend/ 
 */
defineBackend({
  auth,
  data,
  storage,
});
