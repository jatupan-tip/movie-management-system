import {
    Controller,
    Get,
    Body,
    Param,
    Post,
    Patch,
    Delete,
    ParseIntPipe,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

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
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',

                filename: (
                    req,
                    file,
                    callback,
                ) => {
                    const uniqueName =
                        `${uuid()}${extname(file.originalname)}`;

                    callback(
                        null,
                        uniqueName,
                    );
                },
            }),
        }),
    )
    createMovie(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Body() body: CreateMovieDto
    ) {
        return this.movieService.createMovie(
            body,
            req.user.username,
            file?.filename,
        );
    }

    @UseGuards(RolesGuard)
    @Roles('MANAGER', 'TEAMLEADER')
    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',

                filename: (
                    req,
                    file,
                    callback,
                ) => {
                    const uniqueName =
                        `${uuid()}${extname(file.originalname)}`;

                    callback(
                        null,
                        uniqueName,
                    );
                },
            }),
        }),
    )
    updateMovie(
        @Req() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateMovieDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.movieService.updateMovie(
            id,
            body,
            req.user.username,
            file?.filename,
        );
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