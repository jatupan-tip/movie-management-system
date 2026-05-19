import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async createUser(data: RegisterDto) {
        const user = await this.prisma.user.create({
            data,
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