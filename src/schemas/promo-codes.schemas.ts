import {SchemaObject} from '@loopback/rest';

export const PromoCodesPostSchema: SchemaObject = {
  type: 'object',
  title: 'Car Post',
  required: ['userId', 'code', 'value', 'startDate', 'endDate'],
  properties: {
    userId: {type: 'number'},
    code: {type: 'string'},
    value: {type: 'number'},
    startDate: {type: 'string'},
    endDate: {type: 'string'},
  },
};

export const PromoCodesGetConditions: SchemaObject = {
  type: 'object',
  title: 'Get list with condition',
  properties: {
    where: {type: 'object', properties: {status: {type: 'string'}}},
  },
};

export const PromoCodesDeleteMultipleConditions: SchemaObject = {
  type: 'object',
  title: 'Delete with selected ids in array condition',
  properties: {
    ids: {type: 'array'},
  },
};

export const PromoCodesSearchSchema: SchemaObject = {
  type: 'object',
  title: 'Search',
  required: ['code'],
  properties: {
    code: {type: 'string'},
  },
};
