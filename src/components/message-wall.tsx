"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VelocityScroll } from "./ui/velocity-scroll";

const messageSchema = z.object({
  content: z.string().min(1, "请输入祝福内容").max(100, "祝福内容不能超过100个字符"),
});

type MessageForm = z.infer<typeof messageSchema>;

export function MessageWall() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit message");

      // 添加新消息到列表
      setMessages((prev) => [...prev, data.content]);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景效果 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDelay: Math.random() * 5 + "s",
              }}
            />
          ))}
        </div>
      </div>

      {/* 滚动消息 */}
      <div className="pt-24 pb-32">
        <VelocityScroll
          text="生日快乐！愿你的人生如彩虹般绚丽！🌈"
          default_velocity={2}
          className="text-4xl font-bold text-white"
        />
        <VelocityScroll
          text="Happy Birthday! May your life be filled with joy! 🎉"
          default_velocity={3}
          className="text-4xl font-bold text-blue-400"
        />
        <VelocityScroll
          text="祝你生日快乐，心想事成！🎂"
          default_velocity={4}
          className="text-4xl font-bold text-pink-400"
        />
      </div>

      {/* 添加祝福按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-semibold shadow-lg"
      >
        添加祝福
      </motion.button>

      {/* 模态框 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md text-black"
            >
              <h2 className="text-2xl font-bold mb-4">添加生日祝福</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <textarea
                    {...register("content")}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="写下你的祝福..."
                    rows={4}
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "提交中..." : "提交祝福"}
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
