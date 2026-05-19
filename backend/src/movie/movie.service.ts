import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
    constructor(private prisma: PrismaService) { }

    async getMovies() {
        const getMovies = await this.prisma.movie.findMany();

        return {
            message: 'Movies fetched successfully',
            data: getMovies
        }
    }

    async getMoviesById(id: number) {
        const moviesById = await this.prisma.movie.findUnique({
            where: { id: id }
        });

        if (!moviesById) {
            throw new NotFoundException('Movie not found');
        }

        return {
            message: 'Movies found successfully',
            data: moviesById
        }
    }

    async createMovie(body: CreateMovieDto) {
        const createMovie = await this.prisma.movie.create({
            data: body
        });
        
        return {
            message: 'Movie created successfully',
            data: createMovie
        };
    }

    async updateMovie(id: number, body: UpdateMovieDto) {
        await this.getMoviesById(id);

        const updateMovie = await this.prisma.movie.update({
            where: { id: id },
            data: body,
        });

        return {
            message: 'Movie updated successfully',
            data: updateMovie,
        };
    }

    async deleteMovie(id: number) {
        await this.getMoviesById(id);

        const deleteMovie = await this.prisma.movie.delete({
            where: { id: id }
        });

        return {
            message: 'Movie deleted successfully',
            data: deleteMovie
        };
    }
}