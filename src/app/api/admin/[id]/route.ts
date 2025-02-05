import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

const messagesFile = path.join(process.cwd(), 'data/messages.json');

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('Starting DELETE request for message ID:', params.id);
  try {
    // 检查用户是否已登录
    console.log('Checking auth...');
    const { userId } = auth();
    console.log('User ID:', userId);

    if (!userId) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 检查文件是否存在
    try {
      await readFile(messagesFile, 'utf-8');
    } catch (err) {
      console.error('Messages file does not exist:', err);
      // 如果文件不存在，创建一个空数组
      await writeFile(messagesFile, '[]', 'utf-8');
    }

    // 读取现有消息
    console.log('Reading messages from:', messagesFile);
    const content = await readFile(messagesFile, 'utf-8');
    console.log('File content:', content);

    interface Message {
      id: number;
      content: string;
      createdAt: string;
      userId: string;
    }

    let messages: Message[];
    try {
      messages = JSON.parse(content);
      if (!Array.isArray(messages)) {
        console.error('Messages is not an array');
        messages = [];
      }
    } catch (err) {
      console.error('Error parsing messages:', err);
      messages = [];
    }
    console.log('Parsed messages:', messages);

    // 找到并删除指定消息
    const messageId = Number.parseInt(params.id, 10);
    console.log('Message ID to delete:', messageId);
    const updatedMessages = messages.filter((msg: { id: number }) => msg.id !== messageId);
    console.log('Updated messages:', updatedMessages);

    // 写入更新后的消息
    const updatedContent = JSON.stringify(updatedMessages, null, 2);
    console.log('Writing content:', updatedContent);
    try {
      await writeFile(messagesFile, updatedContent, 'utf-8');
      console.log('Successfully wrote to file');
    } catch (err) {
      console.error('Error writing to file:', err);
      throw err;
    }

    console.log('DELETE request completed successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE request:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to delete message', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
