'use client';

import { useUserStore } from '@/store/user';
import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';

const useAuth = () => {
  const username = useUserStore((state) => state.username);
  useLayoutEffect(() => {
    const isAuth = !!username;
    if (!isAuth) {
      redirect('/auth');
    }
  }, [username]);
};

export default useAuth;
