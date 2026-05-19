import { Controller, Get, Body, Param, Post, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@UseGuards(JwtGuard)
@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Get()
    getMovies() {
        return this.movieService.getMovies();
    }

    @Get(':id')
    getMovieById(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.movieService.getMoviesById(id);
    }

    @UseGuards(RolesGuard)
    @Roles('MANAGER', 'TEAMLEADER')
    @Post()
    createMovie(
        @Body() body: CreateMovieDto
    ) {
        return this.movieService.createMovie(body);
    }

    @UseGuards(RolesGuard)
    @Roles('MANAGER', 'TEAMLEADER')
    @Patch(':id')
    updateMovie(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateMovieDto,
    ) {
        return this.movieService.updateMovie(id, body);
    }

    @UseGuards(RolesGuard)
    @Roles('MANAGER')
    @Delete(':id')
    deleteMovie(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.movieService.deleteMovie(id);
    }
}