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
















// import { NextResponse } from 'next/server';
// import { Redis } from '@upstash/redis';
// import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

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
//   const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
//   const path = req.nextUrl.pathname;
//   const rateLimitKey = `rate_limit:${ip}:${path}`;
//   const limit = 10; // Max requests allowed
//   const window = 60; // Time window in seconds

//   // Check Redis availability
//   if (!redis) {
//     console.error('Redis client is not initialized');
//     return NextResponse.json(
//       { error: 'Internal server error while rate limiting.' },
//       { status: 500 }
//     );
//   }

//   // Rate limiting logic
//   try {
//     const current = await redis.incr(rateLimitKey);

//     if (current === 1) {
//       await redis.expire(rateLimitKey, window);
//     }

//     if (current > limit) {
//       return NextResponse.json(
//         { error: 'Rate limit exceeded. Try again later.' },
//         { status: 429 }
//       );
//     }
//   } catch (error) {
//     console.error('Rate limiting error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error while rate limiting.' },
//       { status: 500 }
//     );
//   }

//   // Auth0 protected routes
//   const authMiddleware = withMiddlewareAuthRequired();
//   return authMiddleware(req);
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/api/:path*', '/rules/:path*', '/settings'], // Apply middleware to these routes
// };














import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

/* ------------------------------------
 * 1. Initialize Redis client
 * ---------------------------------- */
let redis;
try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  console.log('Redis initialized successfully');
} catch (error) {
  console.error('Error initializing Redis:', error);
  // You could set `redis = null` here to handle fallback if needed
}

/* ------------------------------------
 * 2. Helper to safely get client IP
 * ---------------------------------- */
function getClientIp(req) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Typically, x-forwarded-for can contain multiple IPs, take the first
    return forwardedFor.split(',')[0].trim();
  }
  // Fallback to req.ip or localhost
  return req.ip || '127.0.0.1';
}

/* --------------------------------------------------
 * 3. Rate-Limiting Middleware (Fixed Window Example)
 * ------------------------------------------------- */
async function rateLimitMiddleware(req) {
  // If no Redis client is available, decide your fallback:
  //  - Throw a 500
  //  - Or skip rate limiting and proceed
  if (!redis) {
    console.error('Redis client is not initialized. Skipping rate limiting.');
    return null; // null = no response, continue chain
  }

  // Identify user route and IP
  const ip = getClientIp(req);
  const path = req.nextUrl.pathname;
  const rateLimitKey = `rate_limit:${ip}:${path}`;

  // Configure your rate limit window and max requests
  const limit = 10;  // max requests
  const window = 60; // time window in seconds

  // Increment the request count in Redis
  try {
    const current = await redis.incr(rateLimitKey);

    // If first request, set expiration
    if (current === 1) {
      await redis.expire(rateLimitKey, window);
    }

    // If user exceeded the limit, return 429
    if (current > limit) {
      // Optionally log the event
      try {
        await redis.lpush('rate_limit_exceeded_logs', JSON.stringify({
          ip,
          path,
          timestamp: Date.now(),
        }));
      } catch (logError) {
        console.error('Error logging rate-limit exceed:', logError);
      }

      return NextResponse.json(
        {
          error: {
            message: 'Rate limit exceeded. Try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(window),                  // Time (in s) until limit resets
            'X-RateLimit-Limit': String(limit),            // Total allowed requests
            'X-RateLimit-Remaining': '0',                  // None remaining
            'X-RateLimit-Reset': String(Date.now() + (window * 1000)), // or just window
          },
        }
      );
    }

    // Within limit, attach rate-limit headers for user’s reference
    return NextResponse.next({
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(limit - current),
        'X-RateLimit-Reset': String(Date.now() + (window * 1000)),
      },
    });

  } catch (error) {
    // If something went wrong in Redis calls, return 500 or skip
    console.error('Rate limiting error:', error);
    return NextResponse.json(
      { error: 'Internal server error while rate limiting.' },
      { status: 500 }
    );
  }
}

/* ------------------------------------
 * 4. Auth0 Middleware
 * ------------------------------------
 * This wraps next-edge-auth0’s `withMiddlewareAuthRequired`
 * to ensure users are authenticated before accessing the matched routes.
 */
function authMiddleware(req) {
  return withMiddlewareAuthRequired()(req);
}

/* ------------------------------------
 * 5. Combined Middleware
 * ------------------------------------
 * We first run the rateLimitMiddleware. If it returns a response
 * (429 or 500), we bail out. Otherwise, we proceed to Auth0 checks.
 */
export async function middleware(req) {
  // 1) Rate-limiting
  const rateLimitResponse = await rateLimitMiddleware(req);
  if (rateLimitResponse) {
    // If rateLimitMiddleware returned a response, block further handling
    return rateLimitResponse;
  }

  // 2) Auth0 Protected Routes
  return authMiddleware(req);
}

/* ------------------------------------
 * 6. Configure Matching Routes
 * ------------------------------------
 * Adjust the matcher as needed.
 * For example, apply to all API routes, your dashboard, etc.
 */
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/rules/:path*', '/settings'],
};
