import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async createUser(body: {
        email: string,
        password: string,
        role: Role,
    }) {
        const user = await this.prisma.user.create({
            data: body,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return {
            message: 'User created successfully',
            data: user,
        };
    }
}