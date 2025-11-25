import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity('pets')
export class Pet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    type: string; // Perro, gato, etc.

    @Column('text', { nullable: true })
    breed: string; // Raza

    @Column('int', { nullable: true })
    age: number;

    @Column('text', {nullable: true })
    notes: string;

    // --- RELACIÓN CON USUARIO ---
    @ManyToOne(() => User, (user) => user.pets, { onDelete: 'CASCADE' })
    user: User;

    @Column({ nullable: true }) // Guardamos el ID del dueño
    userId: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
