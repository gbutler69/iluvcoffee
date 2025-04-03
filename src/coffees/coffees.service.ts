import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Error, Model } from 'mongoose';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  findAll(pagination: PaginationQueryDto) {
    const { limit, offset } = pagination;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
    if (!coffee) {
      throw new NotFoundException(`Coffeed #${id} not found.`);
    }
    return coffee;
  }

  async create(dto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(dto);
    return coffee.save();
  }

  async update(id: string, dto: UpdateCoffeeDto) {
    const updatedCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: dto }, { new: true })
      .exec();
    if (!updatedCoffee) {
      throw new NotFoundException(`Coffee #${id} not found for update.`);
    }
    return updatedCoffee;
  }

  remove(id: string) {
    return this.coffeeModel.findByIdAndDelete(id, {}).exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });
      await recommendEvent.save({ session });
      await coffee.save({ session });
      await session.commitTransaction();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Transaction Failed: ', err.message);
      } else {
        console.error('Transaction Failed: An unknown error occurred.');
      }
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
