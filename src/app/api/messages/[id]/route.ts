import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

const messagesFile = path.join(process.cwd(), 'data/messages.json');

export async function DELETE(
  req: NextRequest,
  context: { 
    params: { id: string } 
  }
) {
  try {
    // 检查用户是否已登录
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 读取现有消息
    const content = await readFile(messagesFile, 'utf-8');
    const messages = JSON.parse(content);

    // 找到并删除指定消息
    const messageId = Number.parseInt(params.id, 10);
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
