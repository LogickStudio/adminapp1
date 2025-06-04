
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-6xl font-bold text-primary-DEFAULT mb-4">404</h1>
      <p className="text-2xl font-medium text-textLight dark:text-textDark mb-2">Page Not Found</p>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary-DEFAULT text-white rounded-lg hover:bg-primary-dark transition-colors text-lg font-medium"
      >
        Go to Dashboard
      </Link>
      <img src="https://picsum.photos/seed/404error/500/300" alt="Lost and confused" className="mt-12 rounded-lg shadow-xl opacity-70 dark:opacity-50" />
    </div>
  );
};

export default NotFoundPage;