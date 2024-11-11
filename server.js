import express from 'express';
import next from 'next';
import cron from 'node-cron';
import { processEmails } from './src/app/tasks/emailProcessor.js';
import { connectToDatabase } from './src/lib/mongodb.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => handle(req, res));

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');

    // Schedule the cron job
    cron.schedule('*/5 * * * *', async () => {
      const { db } = await connectToDatabase();
      const users = await db.collection('Users').find({}).toArray();

      for (const user of users) {
        try {
          await processEmails(user.userId);
          console.log(`Processed emails for user ${user.userId}`);
        } catch (error) {
          console.error(`Failed to process emails for user ${user.userId}`, error);
        }
      }
    });
  });
});
