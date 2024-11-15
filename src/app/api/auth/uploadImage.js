// import { Storage } from '@google-cloud/storage';
// import formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';

// // Set up Google Cloud Storage with service account credentials
// const storage = new Storage({
//   projectId: process.env.GCLOUD_PROJECT_ID,
//   keyFilename: path.join(process.cwd(), ''), // Replace with your service account key path
// });

// const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error('Error parsing form:', err);
//         return res.status(500).json({ message: 'File upload error' });
//       }

//       const file = files.image;
//       const filePath = file.filepath;

//       try {
//         // Upload the image to Google Cloud Storage
//         const bucket = storage.bucket(bucketName);
//         const blob = bucket.file(file.originalFilename);
//         const blobStream = blob.createWriteStream({
//           resumable: false,
//         });

//         // Pipe the image file stream to the storage bucket
//         fs.createReadStream(filePath).pipe(blobStream)
//           .on('error', (err) => {
//             console.error('Upload error:', err);
//             return res.status(500).json({ message: 'Error uploading image' });
//           })
//           .on('finish', async () => {
//             // Make the file publicly accessible
//             await blob.makePublic();

//             // Get the public URL of the uploaded image
//             const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
//             res.status(200).json({ url: publicUrl });
//           });
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ message: 'Error uploading image', details: error.message });
//       }
//     });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
