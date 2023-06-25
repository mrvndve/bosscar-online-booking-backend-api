import {Entity, model, property} from '@loopback/repository';

@model()
export class Mops extends Entity {
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
  name: string;

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

  constructor(data?: Partial<Mops>) {
    super(data);
  }
}

export interface MopsRelations {
  // describe navigational properties here
}

export type MopsWithRelations = Mops & MopsRelations;
