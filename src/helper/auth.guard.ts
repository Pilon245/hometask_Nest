export const checkCredentials = async (
  // todo  тут как функцию или как класс делать
  loginOrEmail: string,
  password: string,
) => {
  const user = await usersRepository.findLoginOrEmail(loginOrEmail);
  if (!user) {
    return false;
  }
  const passwordHash = await _generatePasswordForDb(password);
  const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
  if (!isValid) {
    return false;
  }
  return user;
};
