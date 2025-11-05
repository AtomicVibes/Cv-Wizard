"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { createAppwriteInstances } from '@/lib/appwrite';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const { account } = createAppwriteInstances();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        console.log('User authenticated:', user.$id);
        if (user) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
