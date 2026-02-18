import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'password123';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { nombreusuario: email },
    update: { password: hashed, role: UserRole.admin },
    create: { nombreusuario: email, password: hashed, role: UserRole.admin },
  });

  console.log('✅ Admin creado/actualizado:', email);
}

main()
  .catch((e) => {
    console.error('Error creando admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });