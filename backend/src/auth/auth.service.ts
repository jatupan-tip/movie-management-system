import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) { }

    async register(body: RegisterDto) {
        const user = await this.usersService.findByEmail(body.email);

        if (user) {
            throw new BadRequestException('Email already exists',);
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = await this.usersService.createUser({
            email: body.email,
            password: hashedPassword,
            role: 'FLOORSTAFF',
        });

        return {
            message: 'Register success',
            data: newUser,
        };
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            userId: user.id,
            role: user.role,
        };

        return {
            message: 'Login successful',
            data: {
                access_token: this.jwtService.sign(payload),
            },
        };
    }
}