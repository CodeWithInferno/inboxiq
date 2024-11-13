// import { google } from 'googleapis';
// import getUserTokens from '@/lib/getUserTokens';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');
//   const label = searchParams.get('label') || 'INBOX';  // Default label to INBOX if none is provided
//   const query = searchParams.get('query') || '';  // Handle search queries if provided

//   if (!email) {
//     return new Response(JSON.stringify({ message: 'Email is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     const userTokens = await getUserTokens(email);

//     if (!userTokens || !userTokens.access_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or invalid' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
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

//     // Add a delay to allow Gmail servers to apply label updates
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       labelIds: [label],
//       q: query,
//       maxResults: 10,
//     });

//     // Ensure that messages exist in the response
//     if (!response.data.messages) {
//       return new Response(JSON.stringify({ messages: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const messagePromises = response.data.messages.map(async (message) => {
//       const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });

//       // Check that the message has the correct label to avoid cached issues
//       if (!msg.data.labelIds.includes(label)) {
//         return null;
//       }

//       const decodeBase64 = (data) => {
//         if (!data) return '';  // Handle missing data
//         return Buffer.from(data, 'base64').toString('utf-8');
//       };

//       const getMessageBody = (message) => {
//         let body = '';
//         const parts = message.payload.parts || [message.payload];  // Handle both single-part and multi-part emails

//         for (const part of parts) {
//           if (part.mimeType === 'text/html' && part.body?.data) {
//             body = decodeBase64(part.body.data);
//             break;  // Prioritize HTML content
//           } else if (part.mimeType === 'text/plain' && part.body?.data) {
//             body = decodeBase64(part.body.data);
//           }
//         }

//         return body || 'No content available';
//       };

//       const body = getMessageBody(msg.data);

//       return {
//         id: msg.data.id,
//         threadId: msg.data.threadId,
//         subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//         from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//         body,
//         snippet: msg.data.snippet,
//         timestamp: new Date(parseInt(msg.data.internalDate)),
//       };
//     });

//     const messages = (await Promise.all(messagePromises)).filter(Boolean);
//     return new Response(JSON.stringify({ messages }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });

//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     return new Response(JSON.stringify({ message: 'Internal server error', details: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }























// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import { connectToDatabase } from '@/lib/mongodb';
// import { classifyEmailContent } from '../../../../utils/openai';
// import { archiveEmail, deleteEmail } from '../../../../utils/emailActions';
// import getUserTokens from '@/lib/getUserTokens';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');

//   if (!email) {
//     return new Response(JSON.stringify({ message: 'Email is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     console.log("GET request received at /api/auth/google/fetchEmails");

//     // Retrieve user session and check authentication
//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Fetching tokens for email: ${email} with userId: ${user.sub}`);

//     // Get tokens from database using user's email
//     const userTokens = await getUserTokens(email);
//     console.log("Retrieved user tokens:", userTokens);

//     if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or incomplete' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
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

//     console.log("Fetching unread emails...");
//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'is:unread',
//       maxResults: 10,
//     });

//     if (!response.data.messages) {
//       console.log("No unread emails found.");
//       return new Response(JSON.stringify({ messages: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log("Connecting to MongoDB to retrieve user rules");
//     const db = await connectToDatabase();
//     const userRules = await db
//       .collection('Rules')
//       .find({ userId: user.sub, status: { $in: [true, "true"] } })
//       .toArray();

//     if (userRules.length === 0) {
//       console.log("No active rules found for this user");
//       return new Response(JSON.stringify({ messages: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Found ${userRules.length} active rule(s) for user.`);

//     const processedEmails = await Promise.all(
//       response.data.messages.map(async (message) => {
//         const msg = await gmail.users.messages.get({
//           userId: 'me',
//           id: message.id,
//         });

//         const emailBody = Buffer.from(
//           msg.data.payload?.parts?.[0]?.body?.data || '',
//           'base64'
//         ).toString('utf-8');

//         for (const rule of userRules) {
//           console.log(`Applying rule with prompt: ${rule.promptText}`);

//           const classification = await classifyEmailContent(emailBody, rule.promptText);
//           console.log(`Classification result: ${classification}`);

//           // Normalize classification and rule group for flexible matching
//           const normalizedClassification = classification.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();
//           const normalizedGroup = rule.group.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();

//           // Check if the normalized classification contains the normalized group keyword
//           if (normalizedClassification.includes(normalizedGroup)) {
//             console.log(`Rule matched! Applying action: ${rule.action}`);

//             if (rule.action === 'archive') {
//               await archiveEmail(gmail, message.id);
//               console.log(`Email archived: ${message.id}`);
//             } else if (rule.action === 'delete') {
//               await deleteEmail(gmail, message.id);
//               console.log(`Email deleted: ${message.id}`);
//             }

//             await db.collection('ProcessedEmails').updateOne(
//               { userId: user.sub },
//               {
//                 $push: {
//                   processedEmails: {
//                     emailId: message.id,
//                     label: rule.group,
//                     action: rule.action,
//                     timestamp: new Date(),
//                   },
//                 },
//               },
//               { upsert: true }
//             );
//             console.log(`Processed email recorded in database for email ID: ${message.id}`);
//             break;
//           } else {
//             console.log(`No matching rule for classification: ${classification}`);
//           }
//         }

//         return {
//           id: message.id,
//           subject:
//             msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//           from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//           snippet: msg.data.snippet,
//           timestamp: new Date(parseInt(msg.data.internalDate)),
//         };
//       })
//     );

//     const filteredEmails = processedEmails.filter(Boolean);

//     return new Response(JSON.stringify({ messages: filteredEmails }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     return new Response(
//       JSON.stringify({
//         message: 'Internal server error',
//         details: error.message,
//       }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }


























// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import { connectToDatabase } from '@/lib/mongodb';
// import { classifyEmailContent } from '../../../../utils/openai';
// import { archiveEmail, deleteEmail } from '../../../../utils/emailActions';
// import getUserTokens from '@/lib/getUserTokens';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');

//   if (!email) {
//     return new Response(JSON.stringify({ message: 'Email is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     console.log("GET request received at /api/auth/google/fetchEmails");

//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Fetching tokens for email: ${email} with userId: ${user.sub}`);

//     const userTokens = await getUserTokens(email);
//     if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or incomplete' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
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

//     console.log("Fetching unread emails...");
//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'is:unread',
//       maxResults: 10,
//     });

//     if (!response.data.messages) {
//       console.log("No unread emails found.");
//       return new Response(JSON.stringify({ messages: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log("Connecting to MongoDB to retrieve user rules and processed emails");
//     const db = await connectToDatabase();

//     // Fetch all processed email IDs for the user
//     const processedEmailsData = await db.collection('ProcessedEmails').findOne({ userId: user.sub });
//     const processedEmailIds = new Set(processedEmailsData?.processedEmails.map(e => e.emailId) || []);

//     const userRules = await db
//       .collection('Rules')
//       .find({ userId: user.sub, status: { $in: [true, "true"] } })
//       .toArray();

//     if (userRules.length === 0) {
//       console.log("No active rules found for this user");
//       // Return all unread emails for display purposes
//       const messages = await fetchAllUnreadMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Found ${userRules.length} active rule(s) for user.`);

//     const applyRuleToEmail = async (rule, email) => {
//       const primaryTag = rule.tags && rule.tags.length > 0 ? rule.tags[0] : null;
//       const action = primaryTag ? primaryTag.label.toLowerCase() : null;

//       console.log(`Applying rule with prompt: ${rule.promptText}`);
//       console.log(`Classification result: ${rule.group || 'Unclassified'}`);

//       if (action) {
//         console.log(`Rule matched! Applying action: ${action}`);
//         if (action === "archive") {
//           await archiveEmail(gmail, email.id);
//           console.log(`Email archived: ${email.id}`);
//         } else if (action === "delete") {
//           await deleteEmail(gmail, email.id);
//           console.log(`Email deleted: ${email.id}`);
//         }
//       } else {
//         console.log("No action defined for this rule.");
//       }

//       // Record processed email in the database
//       await db.collection('ProcessedEmails').updateOne(
//         { userId: user.sub },
//         {
//           $push: {
//             processedEmails: {
//               emailId: email.id,
//               label: rule.group,
//               action: action,
//               timestamp: new Date(),
//             },
//           },
//         },
//         { upsert: true }
//       );
//       console.log(`Processed email recorded in database for email ID: ${email.id}`);
//     };

//     const fetchAllUnreadMessages = async (response, gmail) => {
//       return Promise.all(
//         response.data.messages.map(async (message) => {
//           const msg = await gmail.users.messages.get({
//             userId: 'me',
//             id: message.id,
//           });
//           return {
//             id: message.id,
//             subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//             from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//             snippet: msg.data.snippet,
//             timestamp: new Date(parseInt(msg.data.internalDate)),
//           };
//         })
//       );
//     };

//     // Process emails that have not been previously processed
//     const processedEmails = await Promise.all(
//       response.data.messages.map(async (message) => {
//         if (processedEmailIds.has(message.id)) {
//           console.log(`Skipping already processed email ID: ${message.id}`);
//           return null;
//         }

//         const msg = await gmail.users.messages.get({
//           userId: 'me',
//           id: message.id,
//         });

//         const emailBody = Buffer.from(
//           msg.data.payload?.parts?.[0]?.body?.data || '',
//           'base64'
//         ).toString('utf-8');

//         for (const rule of userRules) {
//           const classification = await classifyEmailContent(emailBody, rule.promptText);
//           console.log(`Classification result: ${classification}`);

//           const normalizedClassification = classification.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();
//           const normalizedGroup = rule.group.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();

//           if (normalizedClassification.includes(normalizedGroup)) {
//             await applyRuleToEmail(rule, message);
//             break;
//           } else {
//             console.log(`No matching rule for classification: ${classification}`);
//           }
//         }

//         return {
//           id: message.id,
//           subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//           from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//           snippet: msg.data.snippet,
//           timestamp: new Date(parseInt(msg.data.internalDate)),
//         };
//       })
//     );

//     const filteredEmails = processedEmails.filter(Boolean);
    
//     // If no new emails to process, display all unread emails
//     if (filteredEmails.length === 0) {
//       const messages = await fetchAllUnreadMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     return new Response(JSON.stringify({ messages: filteredEmails }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     return new Response(
//       JSON.stringify({
//         message: 'Internal server error',
//         details: error.message,
//       }),
//       { status: 500, headers: { 'Content-Type': 'application/json' }
//       }
//     );
//   }
// }























// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import { connectToDatabase } from '@/lib/mongodb';
// import { classifyEmailContent } from '../../../../utils/openai';
// import { archiveEmail, deleteEmail } from '../../../../utils/emailActions';
// import getUserTokens from '@/lib/getUserTokens';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');

//   if (!email) {
//     return new Response(JSON.stringify({ message: 'Email is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     console.log("GET request received at /api/auth/google/fetchEmails");

//     // Define fetchAllUnreadMessages here at the beginning
//     const fetchAllUnreadMessages = async (response, gmail) => {
//       return Promise.all(
//         response.data.messages.map(async (message) => {
//           const msg = await gmail.users.messages.get({
//             userId: 'me',
//             id: message.id,
//           });
//           return {
//             id: message.id,
//             subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//             from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//             snippet: msg.data.snippet,
//             timestamp: new Date(parseInt(msg.data.internalDate)),
//           };
//         })
//       );
//     };

//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Fetching tokens for email: ${email} with userId: ${user.sub}`);

//     const userTokens = await getUserTokens(email);
//     if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or incomplete' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
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

//     console.log("Fetching unread emails...");
//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'is:unread',
//       maxResults: 10,
//     });

//     if (!response.data.messages) {
//       console.log("No unread emails found.");
//       return new Response(JSON.stringify({ messages: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log("Connecting to MongoDB to retrieve user rules and processed emails");
//     const db = await connectToDatabase();

//     // Fetch all processed email IDs for the user
//     const processedEmailsData = await db.collection('ProcessedEmails').findOne({ userId: user.sub });
//     const processedEmailIds = new Set(processedEmailsData?.processedEmails.map(e => e.emailId) || []);

//     const userRules = await db
//       .collection('Rules')
//       .find({ userId: user.sub, status: { $in: [true, "true"] } })
//       .toArray();

//     if (userRules.length === 0) {
//       console.log("No active rules found for this user");
//       // Return all unread emails for display purposes
//       const messages = await fetchAllUnreadMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Found ${userRules.length} active rule(s) for user.`);

//     const applyRuleToEmail = async (rule, email) => {
//       const primaryTag = rule.tags && rule.tags.length > 0 ? rule.tags[0] : null;
//       const action = primaryTag ? primaryTag.label.toLowerCase() : null;

//       console.log(`Applying rule with prompt: ${rule.promptText}`);
//       console.log(`Classification result: ${rule.group || 'Unclassified'}`);

//       if (action) {
//         console.log(`Rule matched! Applying action: ${action}`);
//         if (action === "archive") {
//           await archiveEmail(gmail, email.id);
//           console.log(`Email archived: ${email.id}`);
//         } else if (action === "delete") {
//           await deleteEmail(gmail, email.id);
//           console.log(`Email deleted: ${email.id}`);
//         }
//       } else {
//         console.log("No action defined for this rule.");
//       }

//       // Record processed email in the database
//       await db.collection('ProcessedEmails').updateOne(
//         { userId: user.sub },
//         {
//           $push: {
//             processedEmails: {
//               emailId: email.id,
//               label: rule.group,
//               action: action,
//               timestamp: new Date(),
//             },
//           },
//         },
//         { upsert: true }
//       );
//       console.log(`Processed email recorded in database for email ID: ${email.id}`);
//     };

//     // Process emails that have not been previously processed
//     const processedEmails = await Promise.all(
//       response.data.messages.map(async (message) => {
//         if (processedEmailIds.has(message.id)) {
//           console.log(`Skipping already processed email ID: ${message.id}`);
//           return null;
//         }

//         const msg = await gmail.users.messages.get({
//           userId: 'me',
//           id: message.id,
//         });

//         const emailBody = Buffer.from(
//           msg.data.payload?.parts?.[0]?.body?.data || '',
//           'base64'
//         ).toString('utf-8');

//         for (const rule of userRules) {
//           const classification = await classifyEmailContent(emailBody, rule.promptText);
//           console.log(`Classification result: ${classification}`);

//           const normalizedClassification = classification.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();
//           const normalizedGroup = rule.group.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();

//           if (normalizedClassification.includes(normalizedGroup)) {
//             await applyRuleToEmail(rule, message);
//             break;
//           } else {
//             console.log(`No matching rule for classification: ${classification}`);
//           }
//         }

//         return {
//           id: message.id,
//           subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//           from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//           snippet: msg.data.snippet,
//           timestamp: new Date(parseInt(msg.data.internalDate)),
//         };
//       })
//     );

//     const filteredEmails = processedEmails.filter(Boolean);
    
//     // If no new emails to process, display all unread emails
//     if (filteredEmails.length === 0) {
//       const messages = await fetchAllUnreadMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     return new Response(JSON.stringify({ messages: filteredEmails }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     return new Response(
//       JSON.stringify({
//         message: 'Internal server error',
//         details: error.message,
//       }),
//       { status: 500, headers: { 'Content-Type': 'application/json' }
//       }
//     );
//   }
// }




















// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import { connectToDatabase } from '@/lib/mongodb';
// import { classifyEmailContent } from '../../../../utils/openai';
// import { archiveEmail, deleteEmail } from '../../../../utils/emailActions';
// import getUserTokens from '@/lib/getUserTokens';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');

//   if (!email) {
//     return new Response(JSON.stringify({ message: 'Email is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     console.log("GET request received at /api/auth/google/fetchEmails");

//     // Helper function to fetch and decode full email body
//     const fetchAllUnreadMessages = async (response, gmail) => {
//       return Promise.all(
//         response.data.messages.map(async (message) => {
//           const msg = await gmail.users.messages.get({
//             userId: 'me',
//             id: message.id,
//           });

//           // Decode the email body
//           const decodeBase64 = (data) => {
//             if (!data) return '';
//             return Buffer.from(data, 'base64').toString('utf-8');
//           };

//           const getMessageBody = (message) => {
//             let body = '';
//             const parts = message.payload.parts || [message.payload];

//             for (const part of parts) {
//               if (part.mimeType === 'text/html' && part.body?.data) {
//                 body = decodeBase64(part.body.data);
//                 break;
//               } else if (part.mimeType === 'text/plain' && part.body?.data) {
//                 body = decodeBase64(part.body.data);
//               }
//             }
//             return body || 'No content available';
//           };

//           const body = getMessageBody(msg.data);

//           return {
//             id: msg.data.id,
//             threadId: msg.data.threadId,
//             subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//             from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//             body,  // Include the full decoded body
//             snippet: msg.data.snippet,
//             timestamp: new Date(parseInt(msg.data.internalDate)),
//           };
//         })
//       );
//     };

//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Fetching tokens for email: ${email} with userId: ${user.sub}`);

//     const userTokens = await getUserTokens(email);
//     if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or incomplete' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
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

//     console.log("Fetching unread emails...");
//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       q: 'is:unread',
//       maxResults: 10,
//     });

//     if (!response.data.messages) {
//       console.log("No unread emails found.");
//       return new Response(JSON.stringify({ messages: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log("Connecting to MongoDB to retrieve user rules and processed emails");
//     const db = await connectToDatabase();

//     // Fetch all processed email IDs for the user
//     const processedEmailsData = await db.collection('ProcessedEmails').findOne({ userId: user.sub });
//     const processedEmailIds = new Set(processedEmailsData?.processedEmails.map(e => e.emailId) || []);


//     const userRules = await db
//       .collection('Rules')
//       .find({ userId: user.sub, status: { $in: [true, "true"] } })
//       .toArray();

//     if (userRules.length === 0) {
//       console.log("No active rules found for this user");
//       // Return all unread emails for display purposes
//       const messages = await fetchAllUnreadMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Found ${userRules.length} active rule(s) for user.`);

//     const applyRuleToEmail = async (rule, email) => {
//       const primaryTag = rule.tags && rule.tags.length > 0 ? rule.tags[0] : null;
//       const action = primaryTag ? primaryTag.label.toLowerCase() : null;

// =======

//     const userRules = await db
//       .collection('Rules')
//       .find({ userId: user.sub, status: { $in: [true, "true"] } })
//       .toArray();

//     if (userRules.length === 0) {
//       console.log("No active rules found for this user");
//       // Return all unread emails for display purposes
//       const messages = await fetchAllUnreadMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Found ${userRules.length} active rule(s) for user.`);

//     const applyRuleToEmail = async (rule, email) => {
//       const primaryTag = rule.tags && rule.tags.length > 0 ? rule.tags[0] : null;
//       const action = primaryTag ? primaryTag.label.toLowerCase() : null;

// >>>>>>> main
//       console.log(`Applying rule with prompt: ${rule.promptText}`);
//       console.log(`Classification result: ${rule.group || 'Unclassified'}`);

//       if (action) {
//         console.log(`Rule matched! Applying action: ${action}`);
//         if (action === "archive") {
//           await archiveEmail(gmail, email.id);
//           console.log(`Email archived: ${email.id}`);
//         } else if (action === "delete") {
//           await deleteEmail(gmail, email.id);
//           console.log(`Email deleted: ${email.id}`);
//         }
//       } else {
//         console.log("No action defined for this rule.");
//       }

//       // Record processed email in the database
//       await db.collection('ProcessedEmails').updateOne(
//         { userId: user.sub },
//         {
//           $push: {
//             processedEmails: {
//               emailId: email.id,
//               label: rule.group,
//               action: action,
//               timestamp: new Date(),
//             },
//           },
//         },
//         { upsert: true }
//       );
//       console.log(`Processed email recorded in database for email ID: ${email.id}`);
//     };

//     // Process emails that have not been previously processed
//     const processedEmails = await Promise.all(
//       response.data.messages.map(async (message) => {
//         if (processedEmailIds.has(message.id)) {
//           console.log(`Skipping already processed email ID: ${message.id}`);
//           return null;
//         }

//         const msg = await gmail.users.messages.get({
//           userId: 'me',
//           id: message.id,
//         });

//         const emailBody = Buffer.from(
//           msg.data.payload?.parts?.[0]?.body?.data || '',
//           'base64'
//         ).toString('utf-8');

//         for (const rule of userRules) {
//           const classification = await classifyEmailContent(emailBody, rule.promptText);
//           console.log(`Classification result: ${classification}`);

//           const normalizedClassification = classification.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();
//           const normalizedGroup = rule.group.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();

//           if (normalizedClassification.includes(normalizedGroup)) {
//             await applyRuleToEmail(rule, message);
//             break;
//           } else {
//             console.log(`No matching rule for classification: ${classification}`);
//           }
//         }

//         return {
//           id: message.id,
//           subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//           from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//           body: emailBody,  // Include full email body here
//           snippet: msg.data.snippet,
//           timestamp: new Date(parseInt(msg.data.internalDate)),
//         };
//       })
//     );

//     const filteredEmails = processedEmails.filter(Boolean);

//     // If no new emails to process, display all unread emails
//     if (filteredEmails.length === 0) {
//       const messages = await fetchAllUnreadMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     return new Response(JSON.stringify({ messages: filteredEmails }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     return new Response(
//       JSON.stringify({
//         message: 'Internal server error',
//         details: error.message,
//       }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }























// import { google } from 'googleapis';
// import { getSession } from '@auth0/nextjs-auth0';
// import { connectToDatabase } from '@/lib/mongodb';
// import { classifyEmailContent } from '../../../../utils/openai';
// import { archiveEmail, deleteEmail } from '../../../../utils/emailActions';
// import getUserTokens from '@/lib/getUserTokens';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');
//   const label = searchParams.get('label'); // Get label from the query parameters

//   if (!email) {
//     return new Response(JSON.stringify({ message: 'Email is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   const getGmailLabelAndQuery = (label) => {
//     switch (label) {
//       case 'inbox':
//         return { labelId: 'INBOX', query: 'category:primary' };
//       case 'promotions':
//         return { labelId: 'INBOX', query: 'category:promotions' };
//       case 'social':
//         return { labelId: 'INBOX', query: 'category:social' };
//       case 'updates':
//         return { labelId: 'INBOX', query: 'category:updates' };
//       case 'spam':
//         return { labelId: 'SPAM', query: '' };
//       case 'trash':
//         return { labelId: 'TRASH', query: '' };
//       case 'sent':
//         return { labelId: 'SENT', query: '' };
//       case 'drafts':
//         return { labelId: 'DRAFT', query: '' };
//       case 'starred':
//         return { labelId: 'STARRED', query: '' };
//       default:
//         return { labelId: 'INBOX', query: 'category:primary' };
//     }
//   };

//   try {
//     console.log("GET request received at /api/auth/google/fetchEmails");

//     // Helper function to fetch and decode full email body
//     const fetchAllMessages = async (response, gmail) => {
//       return Promise.all(
//         response.data.messages.map(async (message) => {
//           const msg = await gmail.users.messages.get({
//             userId: 'me',
//             id: message.id,
//           });

//           // Decode the email body
//           const decodeBase64 = (data) => {
//             if (!data) return '';
//             return Buffer.from(data, 'base64').toString('utf-8');
//           };

//           const getMessageBody = (message) => {
//             let body = '';
//             const parts = message.payload.parts || [message.payload];

//             for (const part of parts) {
//               if (part.mimeType === 'text/html' && part.body?.data) {
//                 body = decodeBase64(part.body.data);
//                 break;
//               } else if (part.mimeType === 'text/plain' && part.body?.data) {
//                 body = decodeBase64(part.body.data);
//               }
//             }
//             return body || 'No content available';
//           };

//           const body = getMessageBody(msg.data);

//           return {
//             id: msg.data.id,
//             threadId: msg.data.threadId,
//             subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//             from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//             body,  // Include the full decoded body
//             snippet: msg.data.snippet,
//             timestamp: new Date(parseInt(msg.data.internalDate)),
//             isRead: !msg.data.labelIds.includes('UNREAD'), // Add isRead status
//           };
//         })
//       );
//     };

//     const session = await getSession(req);
//     const user = session?.user;

//     if (!user) {
//       return new Response(JSON.stringify({ message: 'User not authenticated' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Fetching tokens for email: ${email} with userId: ${user.sub}`);

//     const userTokens = await getUserTokens(email);
//     if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
//       return new Response(JSON.stringify({ message: 'User tokens not found or incomplete' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' },
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

//     // Get the Gmail label ID and query based on the specified category
//     const { labelId, query } = getGmailLabelAndQuery(label);

//     console.log(`Fetching emails with label: ${labelId} and query: ${query}`);
//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       labelIds: [labelId],
//       maxResults: 10,
//       q: query, // Use query to filter by category
//     });

//     if (!response.data.messages) {
//       console.log("No emails found.");
//       return new Response(JSON.stringify({ messages: [] }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log("Connecting to MongoDB to retrieve user rules and processed emails");
//     const db = await connectToDatabase();

//     // Fetch all processed email IDs for the user
//     const processedEmailsData = await db.collection('ProcessedEmails').findOne({ userId: user.sub });
//     const processedEmailIds = new Set(processedEmailsData?.processedEmails.map(e => e.emailId) || []);

//     const userRules = await db
//       .collection('Rules')
//       .find({ userId: user.sub, status: { $in: [true, "true"] } })
//       .toArray();

//     if (userRules.length === 0) {
//       console.log("No active rules found for this user");
//       // Return all emails for display purposes with read/unread status
//       const messages = await fetchAllMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     console.log(`Found ${userRules.length} active rule(s) for user.`);

//     const applyRuleToEmail = async (rule, email) => {
//       const primaryTag = rule.tags && rule.tags.length > 0 ? rule.tags[0] : null;
//       const action = primaryTag ? primaryTag.label.toLowerCase() : null;

//       if (action === "archive") {
//         await archiveEmail(gmail, email.id);
//       } else if (action === "delete") {
//         await deleteEmail(gmail, email.id);
//       }

//       // Record processed email in the database
//       await db.collection('ProcessedEmails').updateOne(
//         { userId: user.sub },
//         {
//           $push: {
//             processedEmails: {
//               emailId: email.id,
//               label: rule.group,
//               action: action,
//               timestamp: new Date(),
//             },
//           },
//         },
//         { upsert: true }
//       );
//     };

//     const processedEmails = await Promise.all(
//       response.data.messages.map(async (message) => {
//         if (processedEmailIds.has(message.id)) {
//           return null;
//         }

//         const msg = await gmail.users.messages.get({
//           userId: 'me',
//           id: message.id,
//         });

//         const emailBody = Buffer.from(
//           msg.data.payload?.parts?.[0]?.body?.data || '',
//           'base64'
//         ).toString('utf-8');

//         for (const rule of userRules) {
//           const classification = await classifyEmailContent(emailBody, rule.promptText);
//           const normalizedClassification = classification.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();
//           const normalizedGroup = rule.group.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").trim();

//           if (normalizedClassification.includes(normalizedGroup)) {
//             await applyRuleToEmail(rule, message);
//             break;
//           }
//         }

//         return {
//           id: message.id,
//           subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
//           from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
//           body: emailBody,
//           snippet: msg.data.snippet,
//           timestamp: new Date(parseInt(msg.data.internalDate)),
//           isRead: !msg.data.labelIds.includes('UNREAD'),
//         };
//       })
//     );

//     const filteredEmails = processedEmails.filter(Boolean);

//     if (filteredEmails.length === 0) {
//       const messages = await fetchAllMessages(response, gmail);
//       return new Response(JSON.stringify({ messages }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     return new Response(JSON.stringify({ messages: filteredEmails }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     return new Response(
//       JSON.stringify({
//         message: 'Internal server error',
//         details: error.message,
//       }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }






















import { google } from 'googleapis';
import { getSession } from '@auth0/nextjs-auth0';
import { connectToDatabase } from '@/lib/mongodb';
import { classifyEmailContent } from '../../../../utils/openai';
import { archiveEmail, deleteEmail } from '../../../../utils/emailActions';
import getUserTokens from '@/lib/getUserTokens';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const label = searchParams.get('label');

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const getGmailLabelAndQuery = (label) => {
    switch (label.toLowerCase()) {
      case 'inbox':
        return { labelId: 'INBOX', query: 'category:primary' };
      case 'promotions':
        return { labelId: 'CATEGORY_PROMOTIONS', query: 'category:promotions' };
      case 'social':
        return { labelId: 'CATEGORY_SOCIAL', query: 'category:social' };
      case 'updates':
        return { labelId: 'CATEGORY_UPDATES', query: 'category:updates' };
      case 'spam':
        return { labelId: 'SPAM', query: '' };
      case 'trash':
        return { labelId: 'TRASH', query: '' };
      case 'sent':
        return { labelId: 'SENT', query: '' };
      case 'drafts':
        return { labelId: 'DRAFT', query: '' };
      case 'starred':
        return { labelId: 'STARRED', query: '' };
      default:
        return { labelId: 'INBOX', query: '' }; // Empty query for default
    }
  };
  

  try {
    console.log("GET request received at /api/auth/google/fetchEmails");

    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching tokens for email: ${email} with userId: ${user.sub}`);

    const userTokens = await getUserTokens(email);
    if (!userTokens || !userTokens.access_token || !userTokens.refresh_token) {
      return new Response(JSON.stringify({ message: 'User tokens not found or incomplete' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
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

    const { labelId, query } = getGmailLabelAndQuery(label);

    console.log(`Fetching emails with label: ${labelId} and query: ${query}`);
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: [labelId],
      maxResults: 10,
      q: query,
    });

    if (!response.data.messages) {
      console.log("No emails found.");
      return new Response(JSON.stringify({ messages: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log("Connecting to MongoDB to retrieve user rules and processed emails");
    const db = await connectToDatabase();

    const processedEmailsData = await db.collection('ProcessedEmails').findOne({ userId: user.sub });
    const processedEmailIds = new Set(processedEmailsData?.processedEmails.map(e => e.emailId) || []);

    const userRules = await db
      .collection('Rules')
      .find({ userId: user.sub, status: { $in: [true, "true"] } })
      .toArray();

    const fetchAllMessages = async (response) => {
      return Promise.all(
        response.data.messages.map(async (message) => {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });

          const decodeBase64 = (data) => Buffer.from(data || '', 'base64').toString('utf-8');
          const getMessageBody = (msg) => {
            let body = '';
            const parts = msg.payload.parts || [msg.payload];
            for (const part of parts) {
              if (part.mimeType === 'text/html' && part.body?.data) {
                body = decodeBase64(part.body.data);
                break;
              } else if (part.mimeType === 'text/plain' && part.body?.data) {
                body = decodeBase64(part.body.data);
              }
            }
            return body || 'No content available';
          };

          const body = getMessageBody(msg.data);
          return {
            id: msg.data.id,
            threadId: msg.data.threadId,
            subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
            from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
            body,
            snippet: msg.data.snippet,
            timestamp: new Date(parseInt(msg.data.internalDate)),
            isRead: !msg.data.labelIds.includes('UNREAD'),
          };
        })
      );
    };

    if (userRules.length === 0) {
      console.log("No active rules found for this user");
      const messages = await fetchAllMessages(response);
      return new Response(JSON.stringify({ messages }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${userRules.length} active rule(s) for user.`);
    const applyRuleToEmail = async (rule, email) => {
      const primaryTag = rule.tags && rule.tags.length > 0 ? rule.tags[0] : null;
      const action = primaryTag ? primaryTag.label.toLowerCase() : null;

      if (action === "archive") await archiveEmail(gmail, email.id);
      else if (action === "delete") await deleteEmail(gmail, email.id);

      await db.collection('ProcessedEmails').updateOne(
        { userId: user.sub },
        {
          $push: {
            processedEmails: {
              emailId: email.id,
              label: rule.group,
              action,
              timestamp: new Date(),
            },
          },
        },
        { upsert: true }
      );
    };

    const processedEmails = await Promise.all(
      response.data.messages.map(async (message) => {
        if (processedEmailIds.has(message.id)) return null;

        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });

        const emailBody = Buffer.from(msg.data.payload?.parts?.[0]?.body?.data || '', 'base64').toString('utf-8');
        for (const rule of userRules) {
          const classification = await classifyEmailContent(emailBody, rule.promptText);
          if (classification.toLowerCase().includes(rule.group.toLowerCase())) {
            await applyRuleToEmail(rule, message);
            break;
          }
        }
        return {
          id: message.id,
          subject: msg.data.payload.headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
          from: msg.data.payload.headers.find((h) => h.name === 'From')?.value,
          body: emailBody,
          snippet: msg.data.snippet,
          timestamp: new Date(parseInt(msg.data.internalDate)),
          isRead: !msg.data.labelIds.includes('UNREAD'),
        };
      })
    );

    const filteredEmails = processedEmails.filter(Boolean);
    if (filteredEmails.length === 0) {
      const messages = await fetchAllMessages(response);
      return new Response(JSON.stringify({ messages }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ messages: filteredEmails }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        details: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
