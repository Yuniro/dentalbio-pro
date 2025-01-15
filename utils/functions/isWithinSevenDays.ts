export const isWithinSevenDays = (date: Date) => {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - (new Date(date)).getTime();
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  return timeDifference < oneWeekInMilliseconds;
}