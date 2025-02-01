export const generateVerificationCode = () => {
  return `verify-${Math.random().toString(36).substring(2, 15)}`;
}