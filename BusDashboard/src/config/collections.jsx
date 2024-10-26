import { getCollection } from './firebase';

export const collectionReferences = {
  systemReport: getCollection('systemReport'),
  systemData: getCollection('systemData'),
  users: getCollection('users'),
  cases: getCollection('cases'),
  consultations: getCollection('consultations'),
  categories: getCollection('categories'),
  invoices: getCollection('invoices'),
  messages: getCollection('messages'),
  notifications: getCollection('notifications'),
  discounts: getCollection('discounts'),
  services: getCollection('services'),
  ratings: getCollection('ratings'),
  finance: getCollection('finance'),
  schedule: getCollection('schedule'),
  experiences: getCollection('experiences'),
  channels: getCollection('channels'),
  tickets: getCollection('tickets'),
  lawyerOffers: getCollection('lawyerOffers'),
  logs: getCollection('logs'),
};
