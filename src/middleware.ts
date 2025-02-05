import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, req) {
    // 只有管理路由需要认证
    if (!auth.userId && req.nextUrl.pathname.startsWith('/admin')) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  },
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/messages',  // 公开留言提交接口
    '/api/messages/count',
  ],
  ignoredRoutes: [
    '/((?!api|trpc))(_next|.+..+)(.*)',
    '/api/messages/(.*)'
  ]
});
 
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
