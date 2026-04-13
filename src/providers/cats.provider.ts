import { Injectable } from "@nestjs/common";
import { Cat } from "../interfaces/cat.interface";

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [];

    findAll(): Array<Cat> {
        return this.cats;
    }

    create(cat: Cat): void {
        this.cats.push(cat);
    }

}