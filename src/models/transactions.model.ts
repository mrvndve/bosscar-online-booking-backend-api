import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {Users} from './users.model';
import {Cars} from './cars.model';
import {PromoCodes} from './promo-codes.model';
import {Payments} from './payments.model';
import {Passengers} from './passengers.model';

@model()
export class Transactions extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  @property({
    type: 'number',
    required: true,
  })
  carId: number;

  @property({
    type: 'string',
    required: true,
  })
  referenceNo: string;

  @property({
    type: 'string',
    required: true,
  })
  pickUpLocation: string;

  @property({
    type: 'string',
    required: true,
  })
  destinationLocation: string;

  @property({
    type: 'string',
    required: true,
  })
  pickUpDatetime: string;

  @property({
    type: 'string',
    required: true,
  })
  returnDatetime: string;

  @property({
    type: 'number',
  })
  promoCodeId?: number;

  @property({
    type: 'string',
    default: 'pending',
  })
  status?: string;

  @property({
    type: 'number',
    default: 0,
  })
  totalPrice?: number;

  @property({
    type: 'date',
    default: () => new Date().toLocaleString('en-PH'),
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: () => new Date().toLocaleString('en-PH'),
  })
  updatedAt?: string;

  @hasOne(() => Users, {keyFrom: 'userId', keyTo: 'id'})
  users: Users;

  @hasOne(() => Cars, {keyFrom: 'carId', keyTo: 'id'})
  cars: Cars;

  @hasOne(() => PromoCodes, {keyFrom: 'promoCodeId', keyTo: 'id'})
  promoCodes: PromoCodes;

  @hasMany(() => Payments, {keyTo: 'transactionId'})
  payments: Payments[];

  @hasMany(() => Passengers, {keyTo: 'transactionId'})
  passengers: Passengers[];

  constructor(data?: Partial<Transactions>) {
    super(data);
  }
}

export interface TransactionsRelations {
  // describe navigational properties here
}

export type TransactionsWithRelations = Transactions & TransactionsRelations;
