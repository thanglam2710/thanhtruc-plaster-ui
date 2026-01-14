export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);

  const birthYear = birthDateObj.getFullYear();
  const birthMonth = birthDateObj.getMonth();
  const birthDay = birthDateObj.getDate();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  let age = currentYear - birthYear;

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
};