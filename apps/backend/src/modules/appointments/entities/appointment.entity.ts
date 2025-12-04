import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp') // Guardamos fecha y hora exacta
  date: Date;

  @Column('text', { default: 'pending' }) 
  // Estados: 'pending', 'confirmed', 'cancelled', 'finished'
  status: string;

  @Column('text', { nullable: true })
  notes: string;

  // --- RELACIONES ---

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
  @Column()
  userId: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  pet: Pet;
  @Column()
  petId: string;

  @ManyToOne(() => Service)
  service: Service;
  @Column() // Guardamos el ID del servicio para saber cuánto dura y cuesta
  serviceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}