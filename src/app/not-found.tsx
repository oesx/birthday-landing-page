import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Not Found',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">404 - Page Not Found</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400">The page you are looking for does not exist.</p>
    </div>
  );
}
