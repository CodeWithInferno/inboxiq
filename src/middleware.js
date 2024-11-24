// import { NextResponse } from 'next/server';
// import { Redis } from '@upstash/redis';

// let redis;

// try {
//   redis = new Redis({
//     url: process.env.UPSTASH_REDIS_URL,
//     token: process.env.UPSTASH_REDIS_TOKEN,
//   });
//   console.log('Redis initialized successfully');
// } catch (error) {
//   console.error('Error initializing Redis:', error);
// }

// export async function middleware(req) {
//   if (!redis) {
//     console.error('Redis client is not initialized');
//     return NextResponse.json(
//       { error: 'Internal server error while rate limiting.' },
//       { status: 500 }
//     );
//   }

//   const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
//   const path = req.nextUrl.pathname;
//   const key = `rate_limit:${ip}:${path}`;
//   const limit = 10;
//   const window = 60;

//   try {
//     const current = await redis.incr(key);

//     if (current === 1) {
//       await redis.expire(key, window);
//     }

//     if (current > limit) {
//       return NextResponse.json(
//         { error: 'Rate limit exceeded. Try again later.' },
//         { status: 429 }
//       );
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error('Rate limiting error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error while rate limiting.' },
//       { status: 500 }
//     );
//   }
// }

// export const config = {
//   matcher: ['/api/:path*'],
// };
















import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

let redis;

try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  console.log('Redis initialized successfully');
} catch (error) {
  console.error('Error initializing Redis:', error);
}

export async function middleware(req) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
  const path = req.nextUrl.pathname;
  const rateLimitKey = `rate_limit:${ip}:${path}`;
  const limit = 10; // Max requests allowed
  const window = 60; // Time window in seconds

  // Check Redis availability
  if (!redis) {
    console.error('Redis client is not initialized');
    return NextResponse.json(
      { error: 'Internal server error while rate limiting.' },
      { status: 500 }
    );
  }

  // Rate limiting logic
  try {
    const current = await redis.incr(rateLimitKey);

    if (current === 1) {
      await redis.expire(rateLimitKey, window);
    }

    if (current > limit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
    return NextResponse.json(
      { error: 'Internal server error while rate limiting.' },
      { status: 500 }
    );
  }

  // Auth0 protected routes
  const authMiddleware = withMiddlewareAuthRequired();
  return authMiddleware(req);
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/rules/:path*', '/settings'], // Apply middleware to these routes
};
