import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { CreateCoffeeDto } from '../src/coffees/dto/create-coffee.dto';
import request from 'supertest';
import { App } from 'supertest/types';
import { UpdateCoffeeDto } from '../src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    title: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    flavors: expect.arrayContaining(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });

  let app: INestApplication<App>;
  let httpServer: App;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 6433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', async () => {
    return request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Get all [GET /]', () => {
    return request(httpServer)
      .get('/coffees')
      .then(({ body }) => {
        expect((body as [1]).length).toBeGreaterThan(0);
        expect((body as [1])[0]).toEqual(expectedPartialCoffee);
      });
  });

  it('Get one [GET /:id]', () => {
    return request(httpServer)
      .get('/coffees/1')
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Update one [PATCH /:id]', () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      title: 'New and Improved Shipwreck Roast',
    };
    return request(httpServer)
      .patch('/coffees/1')
      .send(updateCoffeeDto)
      .then(({ body }) => {
        expect((body as UpdateCoffeeDto).title).toEqual(updateCoffeeDto.title);

        return request(httpServer)
          .get('/coffees/1')
          .then(({ body }) => {
            expect((body as UpdateCoffeeDto).title).toEqual(
              updateCoffeeDto.title,
            );
          });
      });
  });

  it('Delete one [DELETE /:id]', () => {
    return request(httpServer)
      .delete('/coffees/1')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(httpServer)
          .get('/coffees/1')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
