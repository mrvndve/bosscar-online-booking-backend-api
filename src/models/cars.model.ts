import {Entity, model, property} from '@loopback/repository';

@model()
export class Cars extends Entity {
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
  brand: string;

  @property({
    type: 'string',
    required: true,
    index: {unique: true},
  })
  licensePlate: string;

  @property({
    type: 'number',
    required: true,
  })
  capacity: number;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'number',
  })
  totalPrice?: number;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
  })
  maxLuggage?: string;

  @property({
    type: 'string',
  })
  amenities?: string;

  @property({
    type: 'string',
    default: 'active',
  })
  status?: string;

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

  constructor(data?: Partial<Cars>) {
    super(data);
  }
}

export interface CarsRelations {
  // describe navigational properties here
}

export type CarsWithRelations = Cars & CarsRelations;
