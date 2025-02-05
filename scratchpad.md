# Current Task

使用 Docker Compose 部署项目

## Deployment Steps
[X] 修复构建错误
  - [X] 修复 TypeScript 类型错误（修复了 API 路由类型）
  - [X] 修复 ESLint 警告（处理了未使用的变量）
  - [X] 修复依赖问题（更新了 next.config.js）
[X] 准备 Docker 配置
  - [X] 创建 Dockerfile
  - [X] 创建 docker-compose.yml
  - [X] 创建 nginx.conf
  - [X] 创建 .dockerignore
[X] 配置构建优化
  - [X] 启用 standalone 输出
  - [X] 配置多阶段构建
  - [X] 优化 Docker 缓存
[ ] 部署到 VPS
  - [X] 创建部署包
  - [ ] 上传到 VPS
  - [ ] 启动服务
[ ] 配置域名和 HTTPS
  - [ ] 配置域名解析
  - [ ] 配置 SSL 证书

## Progress

### 相册墙
- [X] 实现基础的网格布局
- [X] 添加无限滚动动画
- [X] 优化滚动效果（奇偶行相反方向）
- [X] 添加鼠标交互（根据鼠标位置调整速度）
- [X] 修复编译错误（移动 handleMouseMove 到 useEffect 外）

## Lessons

## Clerk Authentication
- Clerk 需要正确的环境变量配置：
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
- 使用 `authMiddleware` 的 `afterAuth` 回调可以自定义未认证请求的响应：
  ```typescript
  export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth(auth, req, evt) {
      if (!auth.userId && !auth.isPublicRoute) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        );
      }
    },
  });
  ```
- 在私有仓库中可以将 `.env.local` 文件加入版本控制，但需要从 `.gitignore` 中移除相关配置

## Next.js API Routes
- 在 Next.js 15+ 中，API 路由可能需要添加 `export const dynamic = 'force-dynamic'` 来避免构建时的数据收集错误
- API 路由的参数类型应该直接使用内联类型定义，而不是单独的类型别名：
  ```typescript
  export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
  )
  ```
- 如果不使用某个参数，在参数名前加下划线来避免 ESLint 警告，例如 `_req`
- 路由处理器的第一个参数应该使用 `NextRequest` 而不是 `Request` 类型
- 使用 `import type { NextRequest } from 'next/server'` 而不是 `import { NextRequest }` 来导入类型
- 使用 `@clerk/nextjs/server` 而不是 `@clerk/nextjs` 来导入 auth()



1. React 组件中，如果在 useEffect 中使用了一个函数，应该把这个函数定义在 useEffect 外面，并把它加入到依赖数组中，否则可能会有闭包问题。
2. 在处理大型 JSX 结构时，应该将重复的渲染逻辑提取到单独的函数中，这样可以提高代码的可读性和可维护性。
3. 在使用 GSAP 动画时，要注意在组件卸载时清理所有的动画实例，避免内存泄漏。
4. 当使用 @clerk/nextjs 等包时，需要注意它们的 React 版本要求。如果遇到依赖冲突，可以尝试以下方法：
   - 将 React 版本降级到兼容的版本（如 ^18.2.0）
   - 在安装依赖时使用 --legacy-peer-deps 标志

## Current Task: Deploy React App with Docker

### Progress
[X] 创建 Dockerfile 和 docker-compose.yml
[X] 修复依赖问题（React 版本冲突）
[X] 构建本地 Docker 镜像
[X] 推送镜像到 Docker Hub
[ ] 在 VPS 上部署

### Issues
1. Next.js 构建错误：缺失 tailwindcss、autoprefixer 等依赖
2. turbo 配置格式错误，应该使用新的 rules 格式
3. 组件引用路径问题（@/* 别名解析）

### Current Progress
[X] 修复 next.config.js 中的 turbo 配置
[X] 确保正确配置路径别名（@/*）
[X] 优化 Dockerfile 多阶段构建
[ ] 等待构建完成并验证

### Next Steps
如果构建成功：
1. 在 VPS 上拉取新镜像：docker compose pull
2. 重新启动服务：docker compose up -d

如果构建失败：
1. 检查构建日志
2. 根据错误信息进行调整

### 经验教训
1. 在使用 Next.js 和 Clerk 等依赖时，需要注意 React 版本兼容性
2. 在 Docker 构建过程中，如果遇到依赖冲突，可以尝试以下方法：
   - 使用 --legacy-peer-deps 标志
   - 使用 --force 标志
   - 明确安装特定版本的包
   - 先安装关键依赖，再安装其他包
3. 在 Dockerfile 中，使用多阶段构建可以提高构建成功率并减小最终镜像大小：
   - deps 阶段：只安装依赖
   - builder 阶段：复制依赖并构建应用
   - runner 阶段：设置生产环境并复制构建结果
4. 在 Next.js 项目中，注意正确配置 experimental 选项，如 turbo 应该是一个对象而不是布尔值
5. 在 TypeScript 中，始终为事件处理函数添加正确的类型声明
6. 在 Docker 构建中，注意文件权限和所有权，特别是在使用非 root 用户运行应用时
7. 在 docker-compose.yml 中，避免使用过时的 version 字段，它已经被废弃了

## Future Features

1. 实现音乐播放器组件
   - [ ] 设计播放器 UI
   - [ ] 添加播放控制功能
   - [ ] 集成音乐播放功能

2. 实现留言墙组件
   - [ ] 设计留言卡片样式
   - [ ] 添加留言展示功能
   - [ ] 添加留言提交功能

3. 实现视频背景
   - [ ] 设计视频容器
   - [ ] 添加视频播放控制
   - [ ] 优化视频加载和性能
