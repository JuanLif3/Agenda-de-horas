import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto; // Desestructuramos para separar la contraseña del resto de datos
      const hasshedPassword = await bcrypt.hash(password, 10) // Encriptamos la contraseña (10 saltos es el estándar)
      const user = this.userRepository.create({ // Creamos la instancia del usuario con la pass encriptada
        ...userData,
        password: hasshedPassword,
      });

      await this.userRepository.save(user); // Guardamos en DB
      delete user.password; // Retornamos el usuario SIN la contraseña (por seguridad)
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException ('El email ya está registrado');
      }
      throw new InternalServerErrorException ('Error al crear el usaurio');
    }
  } 

  async findOneByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'fullName'], // Seleccionamos password explícitamente
    });
  }

  // --- Métodos estándar que genera Nest (puedes dejarlos así por ahora) ---
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
