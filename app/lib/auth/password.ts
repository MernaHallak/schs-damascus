import bcrypt from "bcryptjs";

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USER || "";
  const expectedHash = process.env.ADMIN_PASS_HASH || "";
  if (!expectedUser || !expectedHash) return false;

  if (username !== expectedUser) return false;
  return bcrypt.compare(password, expectedHash);
}
