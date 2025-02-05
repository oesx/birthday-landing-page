'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  name: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">留言管理</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="text-center py-8">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">留言管理</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">留言管理</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-200">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                暂无留言
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{message.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {format(new Date(message.createdAt), 'PPpp', { locale: zhCN })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
