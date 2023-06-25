import {
  CountSchema,
  Filter,
  FilterExcludingWhere,
  relation,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Transactions} from '../models';
import {
  CarsRepository,
  TransactionsRepository,
  PaymentsRepository,
} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  TransactionsGetConditions,
  TransactionsPostSchema,
  TransactionsDeleteMultipleConditions,
} from '../schemas/transactions.schemas';
import {ITransactionApiResponse, ICountApiResponse} from '../utilities/types';
import {catchError} from '../utilities/helpers';

export class TransactionsController {
  constructor(
    @repository(TransactionsRepository)
    public transactionsRepository: TransactionsRepository,
    @repository(CarsRepository)
    public carsRepository: CarsRepository,
    @repository(PaymentsRepository)
    public paymentsRepository: PaymentsRepository,
  ) {}

  @authenticate('jwt')
  @post('/transactions')
  @response(200, {
    description: 'Transactions model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transactions)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: TransactionsPostSchema,
        },
      },
    })
    transactions: Omit<Transactions, 'id'>,
  ): Promise<ITransactionApiResponse> {
    const referenceNo = `BC` + new Date().valueOf();
    return this.transactionsRepository
      .create({
        ...transactions,
        referenceNo,
      })
      .then(res => {
        return {status: 'success', message: 'Successfully post.', data: res};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @patch('/transactions-finish/{id}')
  @response(200, {
    description: 'Transactions model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transactions)}},
  })
  async finish(
    @param.path.number('id') id: number,
  ): Promise<ITransactionApiResponse> {
    return this.transactionsRepository
      .updateById(id, {status: 'active'})
      .then(() => {
        this.paymentsRepository.updateAll(
          {status: 'active'},
          {transactionId: id},
        );
      })
      .then(() => {
        return {status: 'success', message: 'Successfully finished.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @patch('/transactions-cancel/{id}')
  @response(200, {
    description: 'Transactions model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transactions)}},
  })
  async cancel(
    @param.path.number('id') id: number,
  ): Promise<ITransactionApiResponse> {
    return this.transactionsRepository
      .updateById(id, {status: 'inactive'})
      .then(() => {
        this.paymentsRepository.updateAll(
          {status: 'inactive'},
          {transactionId: id},
        );
      })
      .then(() => {
        return {status: 'success', message: 'Successfully cancelled.'};
      })
      .catch(error => catchError(error));
  }

  @get('/transactions/count')
  @response(200, {
    description: 'Transactions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<ICountApiResponse> {
    return this.transactionsRepository.count(where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/transactions')
  @response(200, {
    description: 'Array of Transactions model instances',
    content: {
      'application/json': {
        schema: TransactionsGetConditions,
      },
    },
  })
  async find(
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<ITransactionApiResponse> {
    return this.transactionsRepository
      .find({
        where,
        include: [
          {relation: 'users'},
          {relation: 'cars'},
          {relation: 'promoCodes'},
          {relation: 'payments'},
          {relation: 'passengers'},
        ],
      })
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', datas: res};
      })
      .catch(error => catchError(error));
  }

  @patch('/transactions')
  @response(200, {
    description: 'Transactions PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transactions, {partial: true}),
        },
      },
    })
    transactions: Transactions,
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<ICountApiResponse> {
    return this.transactionsRepository
      .updateAll(transactions, where)
      .then(res => {
        return {status: 'success', message: 'Successfully count.', data: res};
      });
  }

  @get('/transactions/{id}')
  @response(200, {
    description: 'Transactions model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Transactions, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Transactions, {exclude: 'where'})
    filter?: FilterExcludingWhere<Transactions>,
  ): Promise<ITransactionApiResponse> {
    return this.transactionsRepository
      .findById(id, {
        include: [
          {relation: 'users'},
          {relation: 'cars'},
          {relation: 'promoCodes'},
          {relation: 'payments'},
          {relation: 'passengers'},
        ],
      })
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', data: res};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @patch('/transactions/{id}')
  @response(204, {
    description: 'Transactions PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transactions, {partial: true}),
        },
      },
    })
    transactions: Transactions,
  ): Promise<ITransactionApiResponse> {
    return this.transactionsRepository
      .updateById(id, transactions)
      .then(() => {
        return {status: 'success', message: 'Successfully patch.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/transactions/{id}')
  @response(204, {
    description: 'Transactions DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<ITransactionApiResponse> {
    return this.transactionsRepository
      .deleteById(id)
      .then(() => {
        return {status: 'success', message: 'Successfully delete.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/transactions')
  @response(204, {
    description: 'Transactions DELETE Multiple success',
    content: {
      'application/json': {
        schema: TransactionsDeleteMultipleConditions,
      },
    },
  })
  async deleteMultiple(
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<ICountApiResponse> {
    return this.transactionsRepository.deleteAll(where).then(res => {
      return {status: 'success', message: 'Successfully delete.', data: res};
    });
  }
}
