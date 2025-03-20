export const isToday = (date: string) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

export const isLastWeek = (date: string) => {
  const today = new Date();
  const checkDate = new Date(date);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return checkDate >= lastWeek && !isToday(date);
};
