// import { google } from 'googleapis';
// import getUserTokens from '@/lib/getUserTokens';

// export async function POST(req) {
//   const { to, subject, body, userEmail } = await req.json();

//   if (!to || !subject || !body || !userEmail) {
//     return new Response(JSON.stringify({ message: 'All fields are required' }), {
//       status: 400,
//     });
//   }

//   try {
//     const userTokens = await getUserTokens(userEmail);

//     if (!userTokens || !userTokens.access_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or invalid' }), {
//         status: 401,
//       });
//     }

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     oauth2Client.setCredentials({
//       access_token: userTokens.access_token,
//       refresh_token: userTokens.refresh_token,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Creating a raw MIME email message with HTML support
//     const rawMessage = [
//       `To: ${to}`,
//       `Subject: ${subject}`,
//       'Content-Type: text/html; charset=UTF-8',
//       'MIME-Version: 1.0',
//       '',
//       body, // Send the HTML-rich body content
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
//   const { to, subject, body, userEmail } = await req.json();

//   if (!to || !subject || !body || !userEmail) {
//     return new Response(JSON.stringify({ message: 'All fields are required' }), {
//       status: 400,
//     });
//   }

//   try {
//     const userTokens = await getUserTokens(userEmail);

//     if (!userTokens || !userTokens.access_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or invalid' }), {
//         status: 401,
//       });
//     }

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     oauth2Client.setCredentials({
//       access_token: userTokens.access_token,
//       refresh_token: userTokens.refresh_token,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     // Create a MIME message
//     const rawMessage = [
//       `To: ${to}`,
//       `Subject: ${subject}`,
//       'Content-Type: text/html; charset=UTF-8',
//       'MIME-Version: 1.0',
//       '',
//       body,
//     ].join('\n');

//     const encodedMessage = Buffer.from(rawMessage)
//       .toString('base64')
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=+$/, '');

//     // Send email using Gmail API
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
import { simpleParser } from 'mailparser';

export async function POST(req) {
  const { to, subject, body, userEmail, attachments } = await req.json();

  if (!to || !subject || !body || !userEmail) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), {
      status: 400,
    });
  }

  try {
    const userTokens = await getUserTokens(userEmail);

    if (!userTokens || !userTokens.access_token) {
      return new Response(JSON.stringify({ message: 'User tokens not found or invalid' }), {
        status: 401,
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Create a MIME message with attachments
    const boundary = '----=_Part_0_1234567890';
    const messageParts = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: 7bit',
      '',
      body, // Styled Quill.js content
    ];

    // Add attachments to the message
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        messageParts.push(
          `--${boundary}`,
          `Content-Type: ${file.type}; name="${file.name}"`,
          'Content-Transfer-Encoding: base64',
          `Content-Disposition: attachment; filename="${file.name}"`,
          '',
          file.content, // Base64-encoded content
        );
      });
    }

    messageParts.push(`--${boundary}--`);

    const rawMessage = messageParts.join('\n');

    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send email using Gmail API
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
