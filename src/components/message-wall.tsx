"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VelocityScroll } from "./ui/velocity-scroll";
import { StarBorder } from "./ui/star-border";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";


const messageSchema = z.object({
  content: z.string().min(1, "请输入祝福内容").max(100, "祝福内容不能超过100个字符"),
});

type MessageForm = z.infer<typeof messageSchema>;

interface Message {
  id: number;
  content: string;
  createdAt: string;
}

export function MessageWall() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // 获取消息
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/admin');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [])



  // 组件加载时获取消息
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: MessageForm) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit message");

      // 提交成功后刷新消息列表
      await fetchMessages();
      // 关闭模态框并重置表单
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative">
      {/* 滚动消息 */}
      <div className="min-h-screen overflow-hidden flex flex-col justify-center gap-20 py-24 relative z-10">

        <VelocityScroll
          text={messages.length > 0 
            ? messages.map((_, i) => i % 4 === 0 ? messages[i].content : '').filter(Boolean).join('   ')
            : '生日快乐！愿你的人生如彩虹般绚丽！🌈'}
          default_velocity={2}
          className="text-4xl font-bold text-white"
        />
        <VelocityScroll
          text={messages.length > 1
            ? messages.map((_, i) => i % 4 === 1 ? messages[i].content : '').filter(Boolean).join('   ')
            : 'Happy Birthday! May your life be filled with joy! 🎉'}
          default_velocity={3}
          className="text-4xl font-bold text-blue-400"
        />
        <VelocityScroll
          text={messages.length > 2
            ? messages.map((_, i) => i % 4 === 2 ? messages[i].content : '').filter(Boolean).join('   ')
            : '祝你生日快乐，心想事成！🎂'}
          default_velocity={2}
          className="text-4xl font-bold text-white"
        />
        <VelocityScroll
          text={messages.length > 3
            ? messages.map((_, i) => i % 4 === 3 ? messages[i].content : '').filter(Boolean).join('   ')
            : 'May your life be filled with joy and happiness! ✨'}
          default_velocity={3}
          className="text-4xl font-bold text-blue-400"
        />
      </div>

      {/* 添加祝福按钮 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <StarBorder
          color="rgb(255, 255, 255)"
          speed="4s"
          onClick={() => setIsModalOpen(true)}
          className="group cursor-pointer"
        >
          <span className="text-base tracking-widest text-white group-hover:text-white/90 transition-colors duration-300">
            留言
          </span>
        </StarBorder>
      </div>

      {/* 模态框 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-zinc-900/70 backdrop-blur-2xl rounded-xl p-6 w-full max-w-md text-white border border-white/10 shadow-2xl ring-1 ring-white/5"
            >
              <h2 className="text-2xl font-bold mb-6 text-white/90">添加留言</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-white/80">留言内容</Label>
                  <Textarea
                    {...register("content")}
                    id="content"
                    placeholder="写下你的留言..."
                    rows={4}
                    className="resize-none bg-zinc-800/50 backdrop-blur-xl border-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/20"
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? "提交中..." : "提交留言"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
