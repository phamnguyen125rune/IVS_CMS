export function calculateAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) {
    return 0;
  }

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) {
    age -= 1;
  }

  return Math.max(age, 0);
}
