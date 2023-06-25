import {SchemaObject} from '@loopback/rest';

export const CarsPostSchema: SchemaObject = {
  type: 'object',
  title: 'Car Post',
  required: ['brand', 'licensePlate', 'capacity'],
  properties: {
    brand: {type: 'string'},
    licensePlate: {type: 'string'},
    capacity: {type: 'number'},
    image: {type: 'string'},
    totalPrice: {type: 'number'},
    description: {type: 'string'},
    maxLuggage: {type: 'number'},
    amenities: {type: 'string'},
  },
};

export const CarsGetConditions: SchemaObject = {
  type: 'object',
  title: 'Get list with condition',
  properties: {
    where: {type: 'object', properties: {status: {type: 'string'}}},
  },
};

export const CarsDeleteMultipleConditions: SchemaObject = {
  type: 'object',
  title: 'Delete with selected ids in array condition',
  properties: {
    ids: {type: 'array'},
  },
};

export const CarSearchSchema: SchemaObject = {
  type: 'object',
  title: 'Car Search Post',
  required: ['pickUpDatetime', 'returnDatetime'],
  properties: {
    pickUpDatetime: {type: 'string'},
    returnDatetime: {type: 'string'},
  },
};
