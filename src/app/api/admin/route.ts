import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';

// 消息验证模式
const messageSchema = z.object({
  content: z.string().min(1).max(100),
});

// 消息文件路径
const messagesPath = path.join(process.cwd(), 'data', 'messages.json');

// 确保数据目录存在
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// 读取消息
async function readMessages() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(messagesPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入消息
async function writeMessages(messages: { id: number; content: string; createdAt: string }[]) {
  await ensureDataDir();
  await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content } = messageSchema.parse(body);

    const messages = await readMessages();
    const newMessage = {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString()
    };

    messages.unshift(newMessage);
    await writeMessages(messages);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await readMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
