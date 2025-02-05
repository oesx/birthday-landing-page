import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

export default clerkMiddleware((request) => {
  const publicPaths = [
    '/',
    '/sign-in*',
    '/sign-up*',
    '/api/webhooks/user',
    '/api/webhooks/clerk'
  ];

  const isPublic = publicPaths.find(
    (path) => createRouteMatcher(path, request).test
  );

  if (isPublic) {
    return null;
  }

  return null;
}, {
  debug: true,
  skipJwksFetch: true
});
 
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
