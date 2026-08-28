import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@movie.com' },
    update: {},
    create: {
      email: 'admin@movie.com',
      username: 'admin',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@movie.com' },
    update: {},
    create: {
      email: 'user@movie.com',
      username: 'testuser',
      passwordHash: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    },
  });

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'
  ];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} genre` },
    });
  }

  const actors = [
    'Tom Hanks', 'Meryl Streep', 'Leonardo DiCaprio', 'Scarlett Johansson',
    'Brad Pitt', 'Natalie Portman', 'Robert De Niro', 'Cate Blanchett'
  ];

  for (const name of actors) {
    await prisma.actor.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const directors = [
    'Steven Spielberg', 'Christopher Nolan', 'Martin Scorsese', 'Quentin Tarantino',
    'David Fincher', 'Denis Villeneuve', 'Greta Gerwig', 'Jordan Peele'
  ];

  for (const name of directors) {
    await prisma.director.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('✅ Admin: admin@movie.com / admin123');
  console.log('✅ User: user@movie.com / user123');
  console.log('✅ Genres created');
  console.log('✅ Actors created');
  console.log('✅ Directors created');
  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
