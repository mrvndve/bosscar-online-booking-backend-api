import {IErrorApiResponse} from '../utilities/types';

export const catchError = (error: any): IErrorApiResponse => {
  if (error.code === 'ER_DUP_ENTRY') {
    const sqlMessage = error.sqlMessage.split(' ');
    return {
      status: 'error',
      message: `Duplicate entry: ${sqlMessage[2]} already in used.`,
    };
  } else {
    return {status: 'error', message: error.message};
  }
};

export const getRandomPassword = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
