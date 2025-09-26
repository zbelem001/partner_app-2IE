import { useState, useEffect } from 'react';
import { UserInfo, getUserInfo, getDisplayUser } from '../utils/auth';

export const useAuth = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = () => {
      const user = getUserInfo();
      setUserInfo(user);
      setIsLoading(false);
    };

    loadUserInfo();
  }, []);

  const displayUser = getDisplayUser(userInfo);

  return { userInfo, displayUser, isLoading };
};
