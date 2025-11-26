import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string; 

    @Column('text', { nullable: true })
    description: string; // Ej: "Consulta General", "Vacuna Antirrábica"

    @Column('int')
    duration: number; // Duración en MINUTOS (Ej: 30, 60). Vital para la agenda.

    @Column('int')
    price: number; // Ej: 15000 (CLP)

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

