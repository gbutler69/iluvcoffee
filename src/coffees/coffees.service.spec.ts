import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        {
          provide: COFFEE_BRANDS,
          useFactory: () => ['Buddy Brew', "Little's", 'Blue Bottle'],
        },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    repository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with id exists', () => {
      it('should return the coffee entity', async () => {
        const coffeeId = 3;
        const expectedCoffee = {};
        repository.findOne?.mockReturnValue(expectedCoffee);
        const actualCoffee = await service.findOne(coffeeId);
        expect(actualCoffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = 1;
        repository.findOne?.mockReturnValue(undefined);
        try {
          await service.findOne(coffeeId);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect((err as NotFoundException).message).toEqual(
            `Coffee #${coffeeId} not found`,
          );
        }
      });
    });
  });
});
