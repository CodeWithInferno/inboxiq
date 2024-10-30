import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserFeatureState } from '@/lib/getUserFeatureState';

function getOpenAIClient(isFeatureEnabled) {
  const apiKey = isFeatureEnabled ? process.env.OPENAI_API_KEY : process.env.DISABLED_API;
  return new OpenAI({ apiKey });
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request body received:", body);

    let { emailBody, userId } = body;

    // Retrieve userId from session if missing in the request
    if (!userId) {
      const session = await getSession(req);
      userId = session?.user?.sub; // Adjust 'sub' if using a different field for user ID
      console.log("Retrieved userId from session:", userId);
    }

    if (!emailBody || !userId) {
      console.error('Email body or user ID is missing');
      return NextResponse.json({ message: 'Email body or user ID is missing' }, { status: 400 });
    }

    // Debugging log in getUserFeatureState
    const isFeatureEnabled = await getUserFeatureState(userId, 'summarizeEmail');
    console.log("Summarize Email feature status for user:", isFeatureEnabled ? "enabled" : "disabled", " | User ID:", userId);

    const openai = getOpenAIClient(isFeatureEnabled);

    if (!isFeatureEnabled) {
      return NextResponse.json({ message: 'Summarize email feature is disabled for this user' }, { status: 403 });
    }

    // Request a summary from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant that summarizes emails.' },
        { role: 'user', content: `Please summarize this email: ${emailBody}` },
      ],
    });

    const summary = response.choices[0].message.content.trim();
    console.log("Summary generated:", summary);

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('Error summarizing email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
