"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Message {
  id: number;
  content: string;
  createdAt: string;
}

export function MessageManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取所有消息
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError('加载消息失败');
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除消息
  const deleteMessage = async (id: number) => {
    if (!confirm('确定要删除这条消息吗？')) return;

    try {
      const response = await fetch(`/api/admin/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete message');
      }

      // 重新加载消息列表
      await fetchMessages();
    } catch (error) {
      setError('删除消息失败');
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">留言管理</h1>
        
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-zinc-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="text-white/90 mb-2">{message.content}</p>
                <p className="text-sm text-white/60">
                  {format(new Date(message.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </p>
              </div>
              <button
                onClick={() => deleteMessage(message.id)}
                className="ml-4 px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
              >
                删除
              </button>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center text-white/60 py-8">
              还没有任何留言
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
