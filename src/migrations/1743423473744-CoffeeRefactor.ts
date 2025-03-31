import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1743423473744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table "coffee" rename column "name" to "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table "coffee" rename column "title" to "name"`,
    );
  }
}
