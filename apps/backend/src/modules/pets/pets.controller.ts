import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { UpdatePetDto } from './dto/update-pet.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('pets')
export class PetsController {
  petRepository: any;
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // <--- Exige el Token
  create(@Body() createPetDto: CreatePetDto, @Request() req) {
    // req.user viene del token que pegaste en Thunder Client
    return this.petsService.create(createPetDto, req.user);
  }

  @Get()
  findAll(user: any) {
    const options: any = {};

    if(user.role !== 'admin') {
      options.where = {userId: user.userId};
    }
    return this.petRepository.find(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(id);
  }
}
