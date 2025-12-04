import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString() // Valida formato ISO 8601 (Ej: "2025-11-28T10:00:00Z")
  @IsNotEmpty()
  date: string;

  @IsUUID()
  @IsNotEmpty()
  petId: string;

  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}