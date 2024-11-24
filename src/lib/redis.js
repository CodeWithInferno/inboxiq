import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  tls: process.env.REDIS_URL.startsWith('rediss://'), // Use TLS if needed
});

export default redis;
