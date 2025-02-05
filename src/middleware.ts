import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, req) {
    // 处理认证错误
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  },
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/webhooks/user',
    '/api/webhooks/clerk',
    '/api/admin',  // 公开的留言板 API
  ],
  ignoredRoutes: [
    '/((?!api|trpc))(_next|.+..+)(.*)'
  ]
});
 
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
