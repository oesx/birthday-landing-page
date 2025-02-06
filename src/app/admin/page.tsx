'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Media } from '@/types/media'

export default function AdminPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 检查本地存储中的认证状态
    const auth = localStorage.getItem('isAuthenticated')
    if (!auth) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      // 获取媒体列表
      fetch('/api/albums')
        .then(res => res.json())
        .then(data => setMedia(data))
        .catch(error => console.error('Error fetching media:', error))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    router.push('/admin/login')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const type = file.type.startsWith('video/') ? 'video' : 'image'

    if (!file || !title) {
      alert('请选择文件并输入标题')
      return
    }

    setUploading(true)
    try {
      // 如果是视频，生成缩略图
      let thumbnail: File | null = null
      if (type === 'video') {
        const video = document.createElement('video')
        video.src = URL.createObjectURL(file)
        await new Promise((resolve) => {
          video.onloadeddata = () => {
            video.currentTime = 1 // 跳到第1秒
          }
          video.onseeked = () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(video, 0, 0)
            canvas.toBlob((blob) => {
              if (blob) {
                thumbnail = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' })
              }
              resolve(null)
            }, 'image/jpeg')
          }
        })
      }

      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('title', title)
      uploadData.append('type', type)
      if (thumbnail) {
        uploadData.append('thumbnail', thumbnail)
      }

      const res = await fetch('/api/albums', {
        method: 'POST',
        body: uploadData,
      })

      if (!res.ok) {
        throw new Error('上传失败')
      }

      const data = await res.json()
      setMedia((prev) => [...prev, data.media])
      e.target.reset()

    } catch (error) {
      console.error('上传错误:', error)
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">媒体管理</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
          >
            退出登录
          </button>
        </div>
        
        <div className="grid gap-8">
          {/* 上传表单 */}
          <form onSubmit={handleUpload} className="space-y-4 p-6 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-white/[0.05] text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/10"
                placeholder="输入标题"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">文件</label>
              <input
                type="file"
                name="file"
                required
                accept="image/*,video/*"
                className="w-full px-4 py-2 rounded-lg bg-neutral-900/50 border border-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
            
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2 px-4 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/10"
            >
              {uploading ? '上传中...' : '上传'}
            </button>
          </form>

          {/* 媒体列表 */}
          <div className="grid grid-cols-3 gap-4">
            {media.map((item) => (
              <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900/50 border border-white/[0.05]">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    poster={item.thumbnail}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm text-white truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
