import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import * as fs from 'fs';

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

        return moviesById;
    }

    async createMovie(
        body: CreateMovieDto,
        username: string,
        filename?: string,
    ) {
        const createMovie = await this.prisma.movie.create({
            data: {
                ...body,
                createdBy: username,
                imageUrl: filename
                    ? `/uploads/${filename}`
                    : null,
            }
        });

        return {
            message: 'Movie created successfully',
            data: createMovie
        };
    }

    async updateMovie(
        id: number,
        body: UpdateMovieDto,
        username: string,
        filename?: string,
    ) {
        const movie = await this.getMoviesById(id);

        const { removeImage, ...movieData } = body;

        if (filename && movie.imageUrl) {
            const oldFile = `.${movie.imageUrl}`;

            if (fs.existsSync(oldFile)) {
                fs.unlinkSync(oldFile);
            }
        }
        
        if (
            removeImage === 'true' &&
            movie.imageUrl
        ) {
            const filePath = `.${movie.imageUrl}`;

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const updateMovie = await this.prisma.movie.update({
            where: { id },

            data: {
                ...movieData,

                updatedBy: username,

                imageUrl:
                    removeImage === 'true'
                        ? null
                        : filename
                            ? `/uploads/${filename}`
                            : movie.imageUrl,
            },
        });

        return {
            message: 'Movie updated successfully',
            data: updateMovie,
        };
    }

    async deleteMovie(id: number) {
        const movie = await this.getMoviesById(id);

        if (movie.imageUrl) {
            const filePath =
                `.${movie.imageUrl}`;

            if (
                fs.existsSync(filePath)
            ) {
                fs.unlinkSync(filePath);
            }
        }

        const deleteMovie = await this.prisma.movie.delete({
            where: { id: id }
        });

        return {
            message: 'Movie deleted successfully',
            data: deleteMovie
        };
    }
}