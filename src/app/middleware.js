// middleware.js
import { withAuth } from '@auth0/nextjs-auth0';

export default withAuth(
  // Middleware function to redirect unauthenticated users
  function middleware(req) {
    // You can add custom middleware logic here if needed
  },
  {
    loginPage: '/api/auth/login',
  }
);

export const config = {
  matcher: ['/dashboard/:path*'], // Protect all routes under /dashboard
};
