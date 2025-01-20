import { cookies } from 'next/headers';

const TARGET_USER_COOKIE_KEY = 'targetUserId';

export const AdminServer = {
  setTargetUserId: (userId: string) => {
    cookies().set(TARGET_USER_COOKIE_KEY, userId, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  },

  getTargetUserId: (): string | null => {
    return cookies().get(TARGET_USER_COOKIE_KEY)?.value || null;
  }
};
