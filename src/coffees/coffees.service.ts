import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  private readonly coffees: Coffee[] = [
    {
      id: 1,
      name: 'Arabica',
      brand: 'Brand A',
      flavors: ['Fruity', 'Floral'],
    },
    {
      id: 2,
      name: 'Robusta',
      brand: 'Brand B',
      flavors: ['Nutty', 'Chocolate'],
    },
    {
      id: 3,
      name: 'Liberica',
      brand: 'Brand C',
      flavors: ['Woody', 'Spicy'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    return this.coffees.find((item) => item.id === +id);
  }

  create(dto: any) {
    this.coffees.push(dto);
    return dto;
  }

  update(id: string, dto: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      // update the existing entity
    }
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
