import {SchemaObject} from '@loopback/rest';

export const TransactionsPostSchema: SchemaObject = {
  type: 'object',
  title: 'Transaction Post',
  required: [
    'userId',
    'carId',
    'pickUpLocation',
    'destinationLocation',
    'pickUpDatetime',
    'returnDatetime',
  ],
  properties: {
    userId: {type: 'number'},
    carId: {type: 'number'},
    promoCodeId: {type: 'number'},
    pickUpLocation: {type: 'string'},
    destinationLocation: {type: 'string'},
    pickUpDatetime: {type: 'string'},
    returnDatetime: {type: 'string'},
    totalPrice: {type: 'number'},
  },
};

export const TransactionsGetConditions: SchemaObject = {
  type: 'object',
  title: 'Get list with condition',
  properties: {
    where: {type: 'object', properties: {status: {type: 'string'}}},
  },
};

export const TransactionsDeleteMultipleConditions: SchemaObject = {
  type: 'object',
  title: 'Delete with selected ids in array condition',
  properties: {
    ids: {type: 'array'},
  },
};
