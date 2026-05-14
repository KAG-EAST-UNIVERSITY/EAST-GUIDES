import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '7lrrwsxb',
  dataset: 'production',
  useCdn: false, // Set to false to ensure fresh data on every load
  apiVersion: '2024-05-14',
});
