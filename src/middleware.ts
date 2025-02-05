import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/webhooks/user',
    '/api/webhooks/clerk'
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
