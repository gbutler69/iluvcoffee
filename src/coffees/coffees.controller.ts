import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { ApiForbiddenResponse } from '@nestjs/swagger';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  @Public()
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.coffeesService.findAll(query);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const coffee = await this.coffeesService.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  @Post()
  create(@Body() dto: CreateCoffeeDto) {
    return this.coffeesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coffeesService.remove(id);
  }
}
