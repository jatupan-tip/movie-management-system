import { PrismaClient, Role }
    from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password =
        await bcrypt.hash('1234', 10);

    await prisma.user.createMany({
        data: [
            {
                email: 'manager@test.com',
                password,
                role: Role.MANAGER,
            },
            {
                email: 'leader@test.com',
                password,
                role: Role.TEAMLEADER,
            },
            {
                email: 'staff@test.com',
                password,
                role: Role.FLOORSTAFF,
            },
        ],

        skipDuplicates: true,
    });

    console.log('Seed success');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });