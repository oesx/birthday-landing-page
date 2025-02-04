import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

// 消息验证模式
const messageSchema = z.object({
  content: z.string().min(1).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content } = messageSchema.parse(body);

    await sql`
      INSERT INTO messages (content, created_at)
      VALUES (${content}, NOW())
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM messages 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
