'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DashboardIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /dashboard/inbox when /dashboard is accessed
    router.replace('/dashboard/inbox');
  }, [router]);

  return null;
};

export default DashboardIndex;

