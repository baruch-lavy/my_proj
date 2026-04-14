import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {

    @IsString()
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    status?: string;

    @IsOptional()
    @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
    priority?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string; // Using string to represent date for simplicity
}