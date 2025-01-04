// // app/api/auth/[auth0]/route.js
// import { handleAuth } from '@auth0/nextjs-auth0';

// export const GET = handleAuth();




// app/api/auth/[auth0]/route.js
import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        afterCallback: async (session, token) => {
          console.log('User session:', session.user);
          // Additional logic if needed
          return session;
        },
      });
    } catch (error) {
      console.error('Callback error:', error);
      res.status(error.status || 500).end(error.message);
    }
  },
});
