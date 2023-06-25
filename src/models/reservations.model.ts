import {Entity, model, property} from '@loopback/repository';

@model()
export class Reservations extends Entity {
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
  fullName: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'string',
  })
  countryCode?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  pickUpLocation?: string;

  @property({
    type: 'string',
  })
  returnLocation?: string;

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
    type: 'date',
    default: () => new Date().toLocaleString('en-PH'),
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: () => new Date().toLocaleString('en-PH'),
  })
  updatedAt?: string;

  constructor(data?: Partial<Reservations>) {
    super(data);
  }
}

export interface ReservationsRelations {
  // describe navigational properties here
}

export type ReservationsWithRelations = Reservations & ReservationsRelations;
