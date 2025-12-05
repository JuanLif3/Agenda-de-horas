import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { use } from 'passport';
@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto, user: any) { // Aquí recibimos los datos de la mascota y el usuario dueño
    const pet = this.petRepository.create({
      ...createPetDto,
      userId: user.userId, // <--- Esto vincula la mascota al usuario del token
    });

    return this.petRepository.save(pet);
  }

  findAll(user: any) {
    const options: any = {
      relations: ['user'],
    };

    // Si NO es admin, filtramos para que solo vea SUS mascotas
    if (user.role !== 'admin') {
      options.where = { userId: user.userId };
    }

    return this.petRepository.find(options);
  }

  findOne(id: string) {
    return this.petRepository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  update(id: string, updatePetDto: UpdatePetDto) {
    return this.petRepository.update(id, updatePetDto);
  }

  remove(id: string) {
    return this.petRepository.delete(id);
  }
}
