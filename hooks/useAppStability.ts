'use client';

import { useEffect } from 'react';

export const useServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);
};

export const useChunkErrorHandler = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Check if it's a chunk loading error
      if (
        error &&
        (error.name === 'ChunkLoadError' ||
         error.message?.includes('Loading chunk') ||
         error.message?.includes('Loading CSS chunk'))
      ) {
        console.warn('Chunk loading error detected:', error);
        
        // Only auto-reload once per session to prevent infinite loops
        if (!sessionStorage.getItem('chunk-error-reload-attempted')) {
          sessionStorage.setItem('chunk-error-reload-attempted', 'true');
          
          // Add a slight delay to prevent immediate reload loops
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          // Show user-friendly message after first attempt
          console.error('Chunk loading failed after retry. Manual refresh may be needed.');
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      if (
        error &&
        typeof error === 'object' &&
        (error.name === 'ChunkLoadError' ||
         (typeof error.message === 'string' && error.message.includes('Loading chunk')))
      ) {
        console.warn('Unhandled chunk loading rejection:', error);
        event.preventDefault();
        
        if (!sessionStorage.getItem('chunk-error-reload-attempted')) {
          sessionStorage.setItem('chunk-error-reload-attempted', 'true');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    };

    // Listen for JavaScript errors
    window.addEventListener('error', handleError);
    
    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Clear the reload flag when the page loads successfully
    const clearReloadFlag = () => {
      setTimeout(() => {
        sessionStorage.removeItem('chunk-error-reload-attempted');
      }, 5000); // Clear after 5 seconds of successful operation
    };

    // Clear on successful load
    clearReloadFlag();

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
};

// Hook that combines both service worker and chunk error handling
export const useAppStability = () => {
  useServiceWorker();
  useChunkErrorHandler();
};
