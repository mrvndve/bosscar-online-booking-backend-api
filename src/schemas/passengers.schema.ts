import {SchemaObject} from '@loopback/rest';

export const PassengersPostSchema: SchemaObject = {
  type: 'object',
  title: 'Passenger Post',
  properties: {
    passengers: {
      type: 'array',
      properties: {
        transactionId: {type: 'number'},
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        idType: {type: 'string'},
        idNumber: {type: 'string'},
        idImage: {type: 'string'},
        luggageNo: {type: 'string'},
      },
    },
  },
};
