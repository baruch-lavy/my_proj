import { All, Body, Controller, Get, Header, HttpCode, Param, ParseIntPipe, Post, Query, Redirect, Req, Res, UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { type Request } from "express";
import { CreateCatSchema, type CreateCatDto } from "../dto/create-cat.dto";
import { CatsService } from "../providers/cats.provider";
import { Cat } from "../interfaces/cat.interface";
import { ForbiddenException } from "../exceptions/forbidden.exception"; 
import { HttpExceptionFilter } from "../exceptions/http-exception.filter";
import { ZodValidationPipe } from "../pipes/validation.pipe";
import { AuthGuard } from "../guards/auth.guard";
import { Roles } from "../decorators/roles.decorator";

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
  @Roles(['admin'])
  // alternatively, you can use the @SetMetadata() decorator to create a custom decorator for roles, but using the Reflector.createDecorator() method is more concise and eliminates the need for an additional file and class
  // @SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(CreateCatSchema))
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
  @UseFilters(HttpExceptionFilter)
  @HttpCode(200)
  allMethods(@Res({passthrough: true}) res, @Req() req: Request): string {
    throw new ForbiddenException('This is a custom error message for all HTTP methods');
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
  getCatById(@Param('id', ParseIntPipe) id: number): string {
    return `This action returns a cat with id: ${id}`;
  }
}
