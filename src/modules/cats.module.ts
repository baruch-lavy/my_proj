import { Module } from "@nestjs/common";
import { CatsController } from "../controllers/cats.controller";
import { CatsService } from "../providers/cats.provider";


@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService], // export CatsService to make it available for other modules that import CatsModule
})
export class CatsModule {}