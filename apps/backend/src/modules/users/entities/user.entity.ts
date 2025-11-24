import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}
