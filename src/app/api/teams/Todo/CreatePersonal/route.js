import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req) {
  try {
    // Get the user's session
    const session = await getSession(req);
    const user = session?.user;

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not authenticated' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse the request body
    const { tasks } = await req.json();

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Tasks array is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Connect to the database
    const db = await connectToDatabase();

    // Map each task to include userId and timestamp
    const taskDocuments = tasks.map((task) => ({
      userId: user.sub, // Associate task with the authenticated user
      title: task.title, // Task title
      description: task.description || '', // Optional description
      priority: task.priority || 'Low', // Default priority to "Low"
      dueDate: task.dueDate || null, // Optional due date
      completed: task.completed || false, // Default to not completed
      createdAt: new Date(), // Timestamp for when the task is created
      updatedAt: new Date(), // Timestamp for when the task is last updated
    }));

    // Insert tasks into the PersonalTasks collection
    const result = await db.collection('PersonalTasks').insertMany(taskDocuments);

    return new Response(
      JSON.stringify({
        message: 'Tasks added successfully',
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error adding personal tasks:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
