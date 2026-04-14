import { Module } from '@nestjs/common';
import { TasksController } from '../controllers/tasks.controller';
import { TasksService } from '../providers/tasks.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../schema/tasks.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [],
})
export class TasksModule {}
