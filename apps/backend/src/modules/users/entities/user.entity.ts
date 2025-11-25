import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Pet } from "../../pets/entities/pet.entity";

@Entity('users') // Nombre de la tabla en Neon
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text')
    password: string;

    @Column('text', { default: 'client' })
    role: string; // Admin o cliente

    @OneToMany(() => Pet, (Pet) => Pet.user)
    pets: Pet[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
