import { getDB } from 'src/lib/db';

function validateApiKey(request) {
  const key = request.headers.get('x-api-key');
  return key === process.env.INTERNAL_API_KEY;
}

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request) {
  if (!validateApiKey(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, subject, message, ipAddress } = body;

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 254 || subject.length > 200 || message.length > 5000) {
      return Response.json({ error: 'Field length exceeds maximum' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const db = await getDB();
    const submission = await db.getRepository('ContactSubmission').save({
      name: sanitize(name),
      email: sanitize(email),
      subject: sanitize(subject),
      message: sanitize(message),
      ipAddress: ipAddress || null,
      read: false,
    });

    return Response.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
