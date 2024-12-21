import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req) {
  try {
    // Get the user session
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract the email of the user from the session
    const userEmail = user.email;

    if (!userEmail) {
      return new Response(JSON.stringify({ message: 'User email not found in session' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body
    const { to, cc, bcc, subject, body, attachments, scheduledTime } = await req.json();

    if (!to || !subject || !body || !scheduledTime) {
      return new Response(JSON.stringify({ message: 'Required fields are missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Convert scheduledTime to a Date object
    const scheduleDateTime = new Date(scheduledTime);
    if (isNaN(scheduleDateTime) || scheduleDateTime < new Date()) {
      return new Response(JSON.stringify({ message: 'Invalid or past scheduled time' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to the database
    const db = await connectToDatabase();

    // Save the email details to the database
    const emailData = {
      userId: user.sub,           // Auth0 user identifier
      email: userEmail,           // User's email
      to,
      cc,
      bcc,
      subject,
      body,
      attachments: attachments || [],
      scheduledTime: scheduleDateTime,
      status: 'scheduled',        // Status to track email scheduling
      createdAt: new Date(),
    };

    const result = await db.collection('ScheduledEmails').insertOne(emailData);

    return new Response(JSON.stringify({ message: 'Email scheduled successfully', emailId: result.insertedId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error scheduling email:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
