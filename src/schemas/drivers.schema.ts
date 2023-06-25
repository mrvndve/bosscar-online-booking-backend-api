import {SchemaObject} from '@loopback/rest';

export const DriversPostSchema: SchemaObject = {
  type: 'object',
  title: 'Driver Post',
  required: ['carId', 'firstName', 'lastName'],
  properties: {
    carId: {type: 'number'},
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    middleName: {type: 'string'},
    birthday: {type: 'string'},
    address: {type: 'string'},
    phoneNumber: {type: 'string'},
    countryCode: {type: 'string'},
    licenseNo: {type: 'string'},
  },
};

export const DriversGetConditions: SchemaObject = {
  type: 'object',
  title: 'Get list with condition',
  properties: {
    where: {type: 'object', properties: {status: {type: 'string'}}},
  },
};

export const DriversDeleteMultipleConditions: SchemaObject = {
  type: 'object',
  title: 'Delete with selected ids in array condition',
  properties: {
    ids: {type: 'array'},
  },
};
