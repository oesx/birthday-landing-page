'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    // 获取环境变量中的用户名和密码
    const correctUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem('isAuthenticated', 'true')
      router.push('/admin')
    } else {
      setError('用户名或密码错误')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-8">HARMozart Backyard</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-white/[0.05] text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-white/[0.05] text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/10"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
