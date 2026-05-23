import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async createUser(body: {
        username: string,
        email: string,
        password: string,
        role: Role,
    }) {
        const user = await this.prisma.user.create({
            data: body,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });

        return {
            message: 'User created successfully',
            data: user,
        };
    }

    async getUsers() {
        const users =
            await this.prisma.user.findMany({
                orderBy: {
                    id: 'asc',
                },

                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
            });

        return {
            message: 'Get users success',
            data: users,
        };
    }

    async updateRole(
        id: number,
        role: Role,
    ) {
        const user =
            await this.prisma.user.findUnique({
                where: { id },
            });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const updated =
            await this.prisma.user.update({
                where: { id },

                data: {
                    role,
                },

                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    status: true,
                },
            });

        return {
            message: 'Update role success',
            data: updated,
        };
    }

    async updateStatus(
        id: number,
        status: string,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const protectedEmails = [
            'manager@test.com',
            'leader@test.com',
            'staff@test.com',
        ];

        if (
            protectedEmails.includes(user.email.toLowerCase()) &&
            status === 'INACTIVE'
        ) {
            throw new BadRequestException(
                'This account cannot be deactivated',
            );
        }

        const updated =
            await this.prisma.user.update({
                where: { id },

                data: {
                    status: status as any,
                },
            });

        return {
            message: 'Update status success',
            data: updated,
        };
    }

    async getMe(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },

            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });

        return {
            message: 'Get profile success',
            data: user,
        };
    }

    async updateMe(
        userId: number,
        body: {
            username: string;
        },
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const protectedEmails = [
            'manager@test.com',
            'leader@test.com',
            'staff@test.com',
        ];

        if (
            protectedEmails.includes(
                user.email.toLowerCase(),
            )
        ) {
            throw new BadRequestException(
                'This username cannot be changed',
            );
        }

        const updated =
            await this.prisma.user.update({
                where: {
                    id: userId,
                },

                data: {
                    username: body.username,
                },
            });

        return {
            message: 'Update profile success',
            data: updated,
        };
    }

    async changePassword(
        userId: number,
        body: {
            currentPassword: string;
            newPassword: string;
            confirmPassword: string;
        },
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const isMatch = await bcrypt.compare(
            body.currentPassword,
            user.password,
        );

        if (!isMatch) {
            throw new BadRequestException(
                'Current password incorrect',
            );
        }

        if (
            body.newPassword !==
            body.confirmPassword
        ) {
            throw new BadRequestException(
                'Password confirmation does not match',
            );
        }

        if (
            body.currentPassword ===
            body.newPassword
        ) {
            throw new BadRequestException(
                'New password must be different',
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                body.newPassword,
                10,
            );

        await this.prisma.user.update({
            where: {
                id: userId,
            },

            data: {
                password: hashedPassword,
            },
        });

        return {
            message: 'Change password success',
        };
    }

    async deactivateAccount(
        userId: number,
    ) {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        const protectedEmails = [
            'manager@test.com',
            'leader@test.com',
            'staff@test.com',
        ];

        if (
            protectedEmails.includes(
                user.email.toLowerCase(),
            )
        ) {
            throw new BadRequestException(
                'This account cannot be deleted',
            );
        }

        await this.prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return {
            message:
                'Account deleted successfully',
        };
    }
}