import {
  Users,
  PromoCodes,
  Cars,
  Drivers,
  Mops,
  Transactions,
  Payments,
  Passengers,
  Reservations,
} from '../models';
import {RequestHandler} from 'express-serve-static-core';
export interface ICarApiResponse {
  status: string;
  message: string;
  data?: Cars;
  datas?: Cars[];
}

export interface ICarSearch {
  pickUpDatetime: string;
  returnDatetime: string;
}
export interface IDriverApiResponse {
  status: string;
  message: string;
  data?: Drivers;
  datas?: Drivers[];
}
export interface IMopApiResponse {
  status: string;
  message: string;
  data?: Mops;
  datas?: Mops[];
}
export interface IPromoCodeApiResponse {
  status: string;
  message: string;
  data?: PromoCodes;
  datas?: PromoCodes[];
}
export interface IPromoCodeSearch {
  code: string;
}
export interface ITransactionApiResponse {
  status: string;
  message: string;
  data?: Transactions;
  datas?: Transactions[];
}
export interface IUserApiResponse {
  status: string;
  message: string;
  token?: string;
  data?: Users;
  datas?: Users[];
}
export interface IUserRegister {
  firstName: string;
  lastName: string;
  middleName: string;
  countryCode: string;
  phNumber: string;
  birthday?: string;
  address?: string;
  role: 'client' | 'sales' | 'admin';
  password: string;
}
export interface IUserForgotPassword {
  phoneNumber: string;
}
export interface IUserChangePassword {
  userId: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface IUserKyc {
  userId: number;
  idNo: string;
  idType: string;
  idImagePath: string;
}
export interface IPaymentApiResponse {
  status: string;
  message: string;
  data?: Payments;
  datas?: Payments[];
}
export interface IPassengerApiResponse {
  status: string;
  message: string;
  data?: Passengers;
  datas?: Passengers[];
}
export interface ICountApiResponse {
  status: string;
  message: string;
  data: {
    count: number;
  };
}
export interface IErrorApiResponse {
  status: string;
  message: string;
}

export type FileUploadHandler = RequestHandler;

export interface IReservationApiResponse {
  status: string;
  message: string;
  data?: Reservations;
  datas?: Reservations[];
}
