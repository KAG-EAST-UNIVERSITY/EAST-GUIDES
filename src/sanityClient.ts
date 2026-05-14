import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '7lrrwsxb',
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2024-05-14',
});
