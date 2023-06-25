import {SchemaObject} from '@loopback/rest';

export const ReservationsPostSchema: SchemaObject = {
  type: 'object',
  title: 'Reservation Post',
  required: ['fullName', 'countryCode', 'phoneNumber'],
  properties: {
    fullName: {type: 'string'},
    countryCode: {type: 'string'},
    phoneNumber: {type: 'string'},
    email: {type: 'string'},
    pickUpLocation: {type: 'string'},
    returnLocation: {type: 'string'},
    pickUpDatetime: {type: 'string'},
    returnDatetime: {type: 'string'},
  },
};

export const ReservationsGetConditions: SchemaObject = {
  type: 'object',
  title: 'Get list with condition',
  properties: {
    where: {type: 'object', properties: {status: {type: 'string'}}},
  },
};

export const ReservationsDeleteMultipleConditions: SchemaObject = {
  type: 'object',
  title: 'Delete with selected ids in array condition',
  properties: {
    ids: {type: 'array'},
  },
};

export const ReservationSearchSchema: SchemaObject = {
  type: 'object',
  title: 'Reservation Search Post',
  required: ['pickUpDatetime', 'returnDatetime'],
  properties: {
    pickUpDatetime: {type: 'string'},
    returnDatetime: {type: 'string'},
  },
};
