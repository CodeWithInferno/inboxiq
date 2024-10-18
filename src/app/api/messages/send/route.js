// import { google } from 'googleapis';
// import getUserTokens from '@/lib/getUserTokens';

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const to = formData.get('to');
//     const subject = formData.get('subject');
//     const body = formData.get('body');
//     const userEmail = formData.get('userEmail'); 

//     // Get user tokens
//     const userTokens = await getUserTokens(userEmail);

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     oauth2Client.setCredentials({
//       access_token: userTokens.access_token,
//       refresh_token: userTokens.refresh_token,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Construct email message
//     const rawMessage = [
//       `To: ${to}`,
//       `Subject: ${subject}`,
//       '',
//       body,
//     ].join('\n');

//     const encodedMessage = Buffer.from(rawMessage)
//       .toString('base64')
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=+$/, '');

//     // Send email via Gmail API
//     await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: {
//         raw: encodedMessage,
//       },
//     });

//     return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return new Response(JSON.stringify({ message: 'Error sending email', details: error.message }), {
//       status: 500,
//     });
//   }
// }






// import { google } from 'googleapis';
// import getUserTokens from '@/lib/getUserTokens';

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const to = formData.get('to');
//     const subject = formData.get('subject');
//     const body = formData.get('body'); // HTML formatted content from React-Quill
//     const userEmail = formData.get('userEmail');

//     // Get user tokens from MongoDB
//     const userTokens = await getUserTokens(userEmail);

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     oauth2Client.setCredentials({
//       access_token: userTokens.access_token,
//       refresh_token: userTokens.refresh_token,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Construct email message
//     const rawMessage = [
//       `To: ${to}`,
//       `Subject: ${subject}`,
//       'MIME-Version: 1.0',
//       'Content-Type: text/html; charset=UTF-8',
//       '',
//       body,  // HTML content from React-Quill
//     ].join('\n');

//     const encodedMessage = Buffer.from(rawMessage)
//       .toString('base64')
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=+$/, '');

//     // Send email via Gmail API
//     await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: {
//         raw: encodedMessage,
//       },
//     });

//     return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return new Response(JSON.stringify({ message: 'Error sending email', details: error.message }), {
//       status: 500,
//     });
//   }
// }




import { google } from 'googleapis';
import getUserTokens from '@/lib/getUserTokens';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const to = formData.get('to');
    const subject = formData.get('subject');
    const body = formData.get('body');
    const userEmail = formData.get('userEmail');
    const attachments = formData.getAll('attachments');  // Handle multiple attachments

    // Get user tokens
    const userTokens = await getUserTokens(userEmail);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Create a message with inline image
    const messageParts = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/related; boundary="boundary"',
      '',
      '--boundary',
      'Content-Type: text/html; charset="UTF-8"',
      '',
      body,  // Use the body content, with <img src="cid:image1"> where image1 is referenced
      '',
      '--boundary',
      'Content-Type: image/png',
      'Content-Disposition: inline; filename="image1.png"',
      'Content-Transfer-Encoding: base64',
      'Content-ID: <image1>',
      '',
      attachments[0],  // Image data (make sure it's base64-encoded)
      '',
      '--boundary--',
    ];

    const rawMessage = messageParts.join('\n');

    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send email via Gmail API
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Error sending email', details: error.message }), {
      status: 500,
    });
  }
}
