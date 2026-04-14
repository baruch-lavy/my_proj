import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { TasksService } from "../providers/tasks.provider";
import { Task } from "../schema/tasks.schema";
import { CreateTaskDto } from "../dto/create-task.dto";

@Controller({
    path: 'tasks',
    version: '1',
})
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    findAll(): Promise<Task[]> {
        return this.tasksService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string): Promise<Task | null> {
        return this.tasksService.findById(id);
    }

    @Post()
    create(@Body() task: CreateTaskDto): Promise<Task> {
        return this.tasksService.create(task);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() task: Partial<CreateTaskDto>): Promise<Task | null> {
        return this.tasksService.update(id, task);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<Task | null> {
        return this.tasksService.delete(id);
    }

}