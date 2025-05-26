'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface RetryWrapperProps {
  children: React.ReactNode;
  onRetry?: () => void;
  errorMessage?: string;
  showError?: boolean;
}

const RetryWrapper: React.FC<RetryWrapperProps> = ({
  children,
  onRetry,
  errorMessage = 'Something went wrong. Please try again.',
  showError = false
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        // Default retry: reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry]);

  if (showError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        {!isOnline ? (
          <WifiOff className="h-12 w-12 text-gray-400 mb-4" />
        ) : (
          <RefreshCw className="h-12 w-12 text-gray-400 mb-4" />
        )}
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {!isOnline ? 'You\'re offline' : 'Connection Error'}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md">
          {!isOnline 
            ? 'Please check your internet connection and try again.'
            : errorMessage
          }
        </p>

        <button
          onClick={handleRetry}
          disabled={isRetrying || !isOnline}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>

        {!isOnline && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            Offline
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {children}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md shadow-lg z-50">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">You're currently offline</span>
          </div>
        </div>
      )}
    </>
  );
};

export default RetryWrapper;
