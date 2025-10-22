import { createClient } from 'redis';

const client = createClient({
  url: "rediss://default:ASLGAAImcDIyZWEwZjcxMzExMmQ0MDhhYjM0MTZmYzcxOTdiN2Y4MnAyODkwMg@sterling-trout-8902.upstash.io:6379"
});

client.on('error', err => console.error('Redis Error', err));
await client.connect();

export default client;
