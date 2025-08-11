// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Todo, UserSubscription, UserProfile, DisabilityApplication, PublicFAQ } = initSchema(schema);

export {
  Todo,
  UserSubscription,
  UserProfile,
  DisabilityApplication,
  PublicFAQ
};