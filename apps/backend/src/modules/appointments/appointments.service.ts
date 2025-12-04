import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import dayjs from 'dayjs'; // Importamos dayjs

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const { date, serviceId, petId, notes } = createAppointmentDto;

    // 1. Validar que la fecha sea futura
    const startNew = dayjs(date);
    if (startNew.isBefore(dayjs())) {
      throw new BadRequestException('No puedes agendar en el pasado');
    }

    // 2. Buscar el servicio para obtener la duración
    const service = await this.serviceRepository.findOneBy({ id: serviceId });
    if (!service) {
      throw new NotFoundException('El servicio seleccionado no existe');
    }

    // 3. Calcular hora de fin
    const endNew = startNew.add(service.duration, 'minute');

    // 4. VALIDACIÓN DE CHOQUES (RF13)
    // Traemos todas las citas de ese día (Confirmadas o Pendientes) para revisar solapamientos
    // Usamos Between para filtrar solo el día en cuestión y optimizar
    const startOfDay = startNew.startOf('day').toDate();
    const endOfDay = startNew.endOf('day').toDate();

    const appointmentsToday = await this.appointmentRepository.find({
      where: {
        date: Between(startOfDay, endOfDay),
      },
      relations: ['service'], // Necesitamos el servicio para saber cuánto duran las otras citas
    });

    // Revisamos si alguna cita existente choca con la nueva
    const hasConflict = appointmentsToday.some((appt) => {
      // Si la cita está cancelada, no cuenta como conflicto
      if (appt.status === 'cancelled') return false;

      const startExisting = dayjs(appt.date);
      const endExisting = startExisting.add(appt.service.duration, 'minute');

      // Lógica de Solapamiento: (InicioA < FinB) y (FinA > InicioB)
      return startNew.isBefore(endExisting) && endNew.isAfter(startExisting);
    });

    if (hasConflict) {
      throw new BadRequestException('Lo sentimos, ese horario ya está ocupado.');
    }

    // 5. Guardar la reserva
    const appointment = this.appointmentRepository.create({
      date: startNew.toDate(),
      notes,
      userId,
      petId,
      serviceId,
      status: 'pending', // Estado inicial
    });

    return this.appointmentRepository.save(appointment);
  }

  findAll() {
    return this.appointmentRepository.find({
      relations: ['user', 'pet', 'service'], // Trae toda la info relacionada
      order: { date: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'pet', 'service'],
    });
  }

  update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentRepository.update(id, updateAppointmentDto);
  }

  remove(id: string) {
    return this.appointmentRepository.delete(id);
  }
}