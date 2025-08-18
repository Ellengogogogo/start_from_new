'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PropertyCreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if user is coming directly to /properties/new without going through user type selection
    if (typeof window !== 'undefined' && !isRedirecting) {
      const userType = sessionStorage.getItem('userType');
      const agentInfo = sessionStorage.getItem('agentInfo');
      
      console.log('Layout check:', { pathname, userType, agentInfo });
      
      // If no user type is set and we're on the main property form page, redirect to user type selection
      if (!userType && !agentInfo && pathname === '/properties/new') {
        console.log('Redirecting to user type selection...');
        setIsRedirecting(true);
        router.replace('/properties/new/user-type');
      }
    }
  }, [router, pathname, isRedirecting]);

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在跳转...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
