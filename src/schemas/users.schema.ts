import {SchemaObject} from '@loopback/rest';

export const UsersPostSchema: SchemaObject = {
  type: 'object',
  title: 'Car Post',
  required: [
    'firstName',
    'lastName',
    'countryCode',
    'phoneNumber',
    'email',
    'role',
  ],
  properties: {
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    middleName: {type: 'string'},
    countryCode: {type: 'string'},
    phoneNumber: {type: 'string'},
    email: {type: 'string'},
    birthday: {type: 'string'},
    address: {type: 'string'},
    role: {type: 'string'},
  },
};

export const UsersGetConditions: SchemaObject = {
  type: 'object',
  title: 'Get list with condition',
  properties: {
    where: {type: 'object', properties: {status: {type: 'string'}}},
  },
};

export const UsersDeleteMultipleConditions: SchemaObject = {
  type: 'object',
  title: 'Delete with selected ids in array condition',
  properties: {
    ids: {type: 'array'},
  },
};

export const UsersPatchSchema: SchemaObject = {
  type: 'object',
  title: 'Update users',
  properties: {
    firstName: {type: 'string'},
    lastname: {type: 'string'},
    middleName: {type: 'string'},
    countryCode: {type: 'string'},
    phoneNumber: {type: 'string'},
    email: {type: 'string'},
    birthday: {type: 'string'},
    address: {type: 'string'},
    role: {type: 'string'},
  },
};

export const UsersRegisterSchema: SchemaObject = {
  type: 'object',
  title: 'Registration',
  required: [
    'firstName',
    'lastName',
    'countryCode',
    'phoneNumber',
    'email',
    'role',
    'password',
  ],
  properties: {
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    middleName: {type: 'string'},
    countryCode: {type: 'string'},
    phoneNumber: {type: 'string'},
    email: {type: 'string'},
    birthday: {type: 'string'},
    address: {type: 'string'},
    role: {type: 'string', enum: ['client', 'sales', 'admin']},
    password: {type: 'string'},
  },
};

export const UsersLoginSchema: SchemaObject = {
  type: 'object',
  title: 'Login',
  required: ['phoneNumber', 'password'],
  properties: {
    phoneNumber: {type: 'string'},
    password: {type: 'string'},
    adminLogin: {type: 'boolean'},
  },
};

export const UsersForgotPasswordSchema: SchemaObject = {
  type: 'object',
  title: 'Forgot Password',
  required: ['phoneNumber'],
  properties: {
    phoneNumber: {type: 'string'},
  },
};

export const UsersChangePasswordSchema: SchemaObject = {
  type: 'object',
  title: 'Change Password',
  required: ['userId', 'oldPassword', 'newPassword', 'confirmPassword'],
  properties: {
    userId: {type: 'number'},
    oldPassword: {type: 'string'},
    newPassword: {type: 'string'},
    confirmPassword: {type: 'string'},
  },
};

export const UsersKycSchema: SchemaObject = {
  type: 'object',
  title: 'Kyc',
  required: ['userId', 'idNo', 'idType', 'idImagePath'],
  properties: {
    userId: {type: 'number'},
    idNo: {type: 'string'},
    idType: {type: 'string'},
    idImagePath: {type: 'string'},
  },
};
