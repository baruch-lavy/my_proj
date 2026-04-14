import { IsDateString, IsEnum, IsString } from "class-validator";

export class CreateTaskDto {
    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsEnum(['OPEN', 'IN_PROGRESS', 'DONE'])
    status!: string;

    @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
    priority!: string;

    @IsDateString()
    dueDate!: string; // Using string to represent date for simplicity
}

