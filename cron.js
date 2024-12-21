// import cron from "node-cron";
// import { google } from "googleapis";
// import { connectToDatabase } from './src/lib/mongodb.js';
// import {decryptToken} from "./src/utils/crypto.js";

// async function getUserTokensByEmail(email) {
//   const db = await connectToDatabase();
//   const user = await db.collection("users").findOne({ email });

//   if (!user || !user.access_token || !user.refresh_token) {
//     throw new Error(`User tokens not found for email: ${email}`);
//   }

//   // Decrypt tokens
//   const accessToken = decryptToken(user.access_token);
//   const refreshToken = decryptToken(user.refresh_token);

//   return { access_token: accessToken, refresh_token: refreshToken };
// }

// async function sendScheduledEmails() {
//   const db = await connectToDatabase();

//   // Fetch scheduled emails
//   const scheduledEmails = await db.collection('ScheduledEmails').find({
//     scheduledTime: { $lte: new Date() },
//     status: 'scheduled',
//   }).toArray();

//   for (const email of scheduledEmails) {
//     console.log(`Processing email for user email: ${email.email}`);

//     try {
//       // Fetch tokens using the user's email
//       const userTokens = await getUserTokensByEmail(email.email);
//       console.log(`Fetched tokens for email ${email.email}:`, userTokens);

//       const oauth2Client = new google.auth.OAuth2(
//         process.env.GOOGLE_CLIENT_ID,
//         process.env.GOOGLE_CLIENT_SECRET
//       );

//       oauth2Client.setCredentials({
//         access_token: userTokens.access_token,
//         refresh_token: userTokens.refresh_token,
//       });

//       const gmail = google.gmail({ version: "v1", auth: oauth2Client });

//       try {
//         // Construct raw email with proper formatting
//         const rawMessage = [
//           `From: Your App Name <${email.from || "youremail@gmail.com"}>`,
//           `To: ${email.to}`,
//           email.cc ? `Cc: ${email.cc}` : "",
//           email.bcc ? `Bcc: ${email.bcc}` : "",
//           `Subject: ${email.subject}`,
//           "",
//           email.body,
//         ].filter(Boolean).join("\r\n");

//         const base64EncodedEmail = Buffer.from(rawMessage)
//           .toString("base64")
//           .replace(/\+/g, "-")
//           .replace(/\//g, "_")
//           .replace(/=+$/, "");

//         await gmail.users.messages.send({
//           userId: "me",
//           requestBody: {
//             raw: base64EncodedEmail,
//           },
//         });

//         // Mark as sent
//         await db.collection('ScheduledEmails').updateOne(
//           { _id: email._id },
//           { $set: { status: 'sent', sentAt: new Date() } }
//         );

//         console.log(`Email sent successfully to ${email.to}`);
//       } catch (sendError) {
//         console.error(`Failed to send email to ${email.to}:`, sendError.message);
//         await db.collection('ScheduledEmails').updateOne(
//           { _id: email._id },
//           { $set: { status: 'failed', error: sendError.message } }
//         );
//       }
//     } catch (tokenError) {
//       console.error(`Error fetching tokens for email ${email.email}:`, tokenError.message);
//       await db.collection('ScheduledEmails').updateOne(
//         { _id: email._id },
//         { $set: { status: 'failed', error: tokenError.message } }
//       );
//     }
//   }
// }

// // Schedule the cron job
// cron.schedule("* * * * *", sendScheduledEmails);










import cron from "node-cron";
import { google } from "googleapis";
import { connectToDatabase } from './src/lib/mongodb.js';
import { decryptToken } from "./src/utils/crypto.js";

const constructRawEmail = (email) => {
  const boundary = "----=_Part_0_1234567890";
  const isHtml = email.body && email.body.trim().startsWith("<");
  const contentType = isHtml
    ? "Content-Type: text/html; charset=UTF-8"
    : "Content-Type: text/plain; charset=UTF-8";

  // Start the MIME message
  const messageParts = [
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    contentType,
    "",
    email.body || "(No content provided)",
  ];

  // Add attachments if present
  if (email.attachments && email.attachments.length > 0) {
    email.attachments.forEach((file) => {
      messageParts.push(
        `--${boundary}`,
        `Content-Type: ${file.type}; name="${file.name}"`,
        "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${file.name}"`,
        "",
        file.content // Assume this is already base64 encoded
      );
    });
  }

  // End the MIME message
  messageParts.push(`--${boundary}--`);

  const rawMessage = messageParts.join("\r\n");

  // Debugging: Log the constructed message
  console.log("Constructed MIME Message:");
  console.log(rawMessage);

  const base64EncodedEmail = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return base64EncodedEmail;
};




async function getUserTokensByEmail(email) {
  const db = await connectToDatabase();
  const user = await db.collection("users").findOne({ email });

  if (!user || !user.access_token || !user.refresh_token) {
    throw new Error(`User tokens not found for email: ${email}`);
  }

  // Decrypt tokens
  const accessToken = decryptToken(user.access_token);
  const refreshToken = decryptToken(user.refresh_token);

  return { access_token: accessToken, refresh_token: refreshToken };
}

async function sendScheduledEmails() {
  const db = await connectToDatabase();

  // Fetch scheduled emails
  const scheduledEmails = await db.collection("ScheduledEmails").find({
    scheduledTime: { $lte: new Date() },
    status: "scheduled",
  }).toArray();

  for (const email of scheduledEmails) {
    console.log(`Processing email for user email: ${email.email}`);

    try {
      // Fetch tokens using the user's email
      const userTokens = await getUserTokensByEmail(email.email);
      console.log(`Fetched tokens for email ${email.email}:`, userTokens);

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      oauth2Client.setCredentials({
        access_token: userTokens.access_token,
        refresh_token: userTokens.refresh_token,
      });

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });

      try {
        // Construct and send the raw email
        const base64EncodedEmail = constructRawEmail(email);

        await gmail.users.messages.send({
          userId: "me",
          requestBody: {
            raw: base64EncodedEmail, // Base64 encoded raw email
          },
        });
        
        // Debugging
        console.log("Payload sent to Gmail API:", {
          userId: "me",
          requestBody: {
            raw: base64EncodedEmail,
          },
        });
        

        // Mark as sent
        await db.collection("ScheduledEmails").updateOne(
          { _id: email._id },
          { $set: { status: "sent", sentAt: new Date() } }
        );

        console.log(`Email sent successfully to ${email.to}`);
      } catch (sendError) {
        console.error(`Failed to send email to ${email.to}:`, sendError.message);
        await db.collection("ScheduledEmails").updateOne(
          { _id: email._id },
          { $set: { status: "failed", error: sendError.message } }
        );
      }
    } catch (tokenError) {
      console.error(`Error fetching tokens for email ${email.email}:`, tokenError.message);
      await db.collection("ScheduledEmails").updateOne(
        { _id: email._id },
        { $set: { status: "failed", error: tokenError.message } }
      );
    }
  }
}

// Schedule the cron job
cron.schedule("* * * * *", sendScheduledEmails);
