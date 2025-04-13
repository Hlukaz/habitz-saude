
export const formatCurrentWeek = () => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  
  const startDay = startOfWeek.getDate();
  const endDay = endOfWeek.getDate();
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const startMonth = monthNames[startOfWeek.getMonth()];
  const endMonth = monthNames[endOfWeek.getMonth()];
  
  return `${startDay} - ${endDay} ${startMonth}`;
};
