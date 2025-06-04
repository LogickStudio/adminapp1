
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { DashboardIcon } from '../constants.js'; // Using DashboardIcon as a generic app icon

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputClasses = "mt-1 block w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400";
  const labelClasses = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";


  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-cardLight dark:bg-cardDark shadow-2xl rounded-xl p-8 border border-borderLight dark:border-borderDark">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary-DEFAULT p-3 rounded-full mb-4">
            <DashboardIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary-DEFAULT dark:text-primary-light">Labisco Admin</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Sign in to manage your shop</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={inputClasses}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={inputClasses}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-400/10 p-3 rounded-md text-center border border-red-500/30 dark:border-red-400/30">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark focus:ring-primary-DEFAULT transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
      <footer className="mt-8 text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          &copy; {new Date().getFullYear()} Labisco Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;