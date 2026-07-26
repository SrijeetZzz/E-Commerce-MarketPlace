export const maskAccountNumber = (accountNumber: string) => {
  if (accountNumber.length <= 4) return accountNumber;

  return "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4);
};