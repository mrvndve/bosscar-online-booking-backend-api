import {SchemaObject} from '@loopback/rest';

export const PaymentsPostSchema: SchemaObject = {
  type: 'object',
  title: 'Payment Post',
  required: ['transactionId', 'mopId'],
  properties: {
    transactionId: {type: 'number'},
    mopId: {type: 'number'},
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    accountName: {type: 'string'},
    accountNo: {type: 'string'},
    countryCode: {type: 'string'},
    phoneNumber: {type: 'string'},
  },
};
