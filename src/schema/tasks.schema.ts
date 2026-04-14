import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;


@Schema({ timestamps: true }) 
export class Task {

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: 'OPEN', enum: ['OPEN', 'IN_PROGRESS', 'DONE'] })
  status!: string;

  @Prop({ default: 'MEDIUM', enum: ['LOW', 'MEDIUM', 'HIGH'] })
  priority!: string;

  @Prop({ required: true })
  dueDate!: Date;
}

// 4. This creates the actual Mongoose schema from the class
export const TaskSchema = SchemaFactory.createForClass(Task);
