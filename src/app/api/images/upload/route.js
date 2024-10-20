import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

// Instantiate Google Cloud Storage client
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: 'public/InboxIQ IAM and Admin Teamlink.json',  // Path to your service account JSON
});

const bucketName = 'YOUR_BUCKET_NAME';  // Replace with your Google Cloud Storage bucket name

export async function POST(req) {
  try {
    // Extract form data from the request
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new Response('File not found in request', { status: 400 });
    }

    // Convert the file into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${Date.now()}-${file.name}`;  // Create a unique file name
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(fileName);
    
    const stream = blob.createWriteStream({
      resumable: false,
    });

    // Upload the file to Google Cloud Storage
    stream.end(buffer);

    // Handle stream errors and successful upload
    stream.on('finish', () => {
      console.log(`File ${fileName} uploaded successfully.`);
    });

    stream.on('error', (err) => {
      console.error('Error uploading file:', err);
      return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    });

    // Return the public URL of the uploaded image
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
