import {Entity, model, property} from '@loopback/repository';

@model()
export class Passengers extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'number',
    required: true,
  })
  transactionId: number;

  @property({
    type: 'string',
  })
  idType?: string;

  @property({
    type: 'string',
  })
  idNumber?: string;

  @property({
    type: 'string',
  })
  idImage?: string;

  @property({
    type: 'number',
  })
  luggageNo?: number;

  @property({
    type: 'string',
    default: 'active',
  })
  status?: string;

  constructor(data?: Partial<Passengers>) {
    super(data);
  }
}

export interface PassengersRelations {
  // describe navigational properties here
}

export type PassengersWithRelations = Passengers & PassengersRelations;
