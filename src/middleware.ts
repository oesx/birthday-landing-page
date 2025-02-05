import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/webhooks/user',
    '/api/webhooks/clerk',
    '/api/messages',  // 公开的留言板 API
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
