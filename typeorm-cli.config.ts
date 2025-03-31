import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Flavor } from 'src/coffees/entities/flavor.entity';
import { CoffeeRefactor1743423473744 } from 'src/migrations/1743423473744-CoffeeRefactor';
import { SchemaSync1743429409998 } from 'src/migrations/1743429409998-SchemaSync';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 6432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: [Coffee, Flavor],
  migrations: [CoffeeRefactor1743423473744, SchemaSync1743429409998],
});
