import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { auth } from '@clerk/nextjs';

const messagesFile = path.join(process.cwd(), 'data/messages.json');

// DELETE /api/messages/[id]
export async function DELETE(request: Request) {
  // 检查用户是否已登录
  const { userId } = auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  try {
    // 读取现有消息
    const content = await readFile(messagesFile, 'utf-8');
    const messages = JSON.parse(content);

    // 找到并删除指定消息
    const url = new URL(request.url);
    const messageId = parseInt(url.pathname.split('/').pop() || '0');
    const updatedMessages = messages.filter((msg: { id: number }) => msg.id !== messageId);

    // 写入更新后的消息
    await writeFile(messagesFile, JSON.stringify(updatedMessages, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
