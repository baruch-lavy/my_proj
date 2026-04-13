import { All, Body, Controller, Get, Header, HttpCode, HttpException, HttpStatus, Param, Post, Query, Redirect, Req, Res } from "@nestjs/common";
import { type Request } from "express";
import { CreateCatDto } from "../dto/create-cat.dto";
import { CatsService } from "../providers/cats.provider";
import { Cat } from "../interfaces/cat.interface";
import { ForbiddenException } from "../exceptions/forbidden.exception";

@Controller({
    path: 'cats',
    version: '1',
    // host: 'api.example.com',
})
export class CatsController {
  constructor(private readonly catsService: CatsService) {}
  @Get()
  @HttpCode(200)
  findAll(@Res({passthrough: true}) res, @Req() req: Request): Cat[] {
    try {
      return this.catsService.findAll();  
    } catch (error : any) {
      throw new ForbiddenException('Forbidden', error); 
    }
  }
  
  @Post('create')
  @HttpCode(201)
  create(@Body() createCatDto: CreateCatDto, @Res({passthrough: true}) res, @Req() req: Request): string {
    try {
      this.catsService.create(createCatDto);
      return 'Cat created successfully';
    } catch (error : any) {
      throw new ForbiddenException('Forbidden', error);
    }
  }

  @All('all')
  @HttpCode(200)
  allMethods(@Res({passthrough: true}) res, @Req() req: Request): string {
    return "This action handles all HTTP methods";
  }

  @Get('custom/*')
  @HttpCode(200)
  customResponse(@Res({passthrough: true}) res, @Req() req: Request): string {
   return 'This action returns a custom response to any path that begins with "custom/"';
  }

  // headers, query params, body, etc. can be accessed through the @Req() decorator and the Request object from Express

  // res headers example
  @Get('headers')
  @Header('X-Custom-Header', 'CustomHeaderValue')
  customHeaders(): string {
    return 'This action returns a response with custom headers';
  }

  // redirect example
  @Get('google')
  @Redirect('https://www.google.com', 302)
  redirectToGoogle(): void {}

  // query params example
  @Get('search')
  searchCats(@Query() query: { name?: string; age?: number }): string {
    const { name, age } = query;
    return `This action searches for cats with name: ${name} and age: ${age}`;
  }
  
  // route params example
  @Get(':id')
  getCatById(@Param('id') id: string): string {
    return `This action returns a cat with id: ${id}`;
  }
}
