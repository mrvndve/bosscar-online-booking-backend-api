import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Transactions,
  Payments,
} from '../models';
import {TransactionsRepository} from '../repositories';

export class TransactionsPaymentsController {
  constructor(
    @repository(TransactionsRepository) protected transactionsRepository: TransactionsRepository,
  ) { }

  @get('/transactions/{id}/payments', {
    responses: {
      '200': {
        description: 'Array of Transactions has many Payments',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Payments)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Payments>,
  ): Promise<Payments[]> {
    return this.transactionsRepository.payments(id).find(filter);
  }

  @post('/transactions/{id}/payments', {
    responses: {
      '200': {
        description: 'Transactions model instance',
        content: {'application/json': {schema: getModelSchemaRef(Payments)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Transactions.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, {
            title: 'NewPaymentsInTransactions',
            exclude: ['id'],
            optional: ['transactionId']
          }),
        },
      },
    }) payments: Omit<Payments, 'id'>,
  ): Promise<Payments> {
    return this.transactionsRepository.payments(id).create(payments);
  }

  @patch('/transactions/{id}/payments', {
    responses: {
      '200': {
        description: 'Transactions.Payments PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, {partial: true}),
        },
      },
    })
    payments: Partial<Payments>,
    @param.query.object('where', getWhereSchemaFor(Payments)) where?: Where<Payments>,
  ): Promise<Count> {
    return this.transactionsRepository.payments(id).patch(payments, where);
  }

  @del('/transactions/{id}/payments', {
    responses: {
      '200': {
        description: 'Transactions.Payments DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Payments)) where?: Where<Payments>,
  ): Promise<Count> {
    return this.transactionsRepository.payments(id).delete(where);
  }
}
