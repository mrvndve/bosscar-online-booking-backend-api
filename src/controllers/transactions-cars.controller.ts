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
  Cars,
} from '../models';
import {TransactionsRepository} from '../repositories';

export class TransactionsCarsController {
  constructor(
    @repository(TransactionsRepository) protected transactionsRepository: TransactionsRepository,
  ) { }

  @get('/transactions/{id}/cars', {
    responses: {
      '200': {
        description: 'Transactions has one Cars',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cars),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Cars>,
  ): Promise<Cars> {
    return this.transactionsRepository.cars(id).get(filter);
  }

  @post('/transactions/{id}/cars', {
    responses: {
      '200': {
        description: 'Transactions model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cars)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Transactions.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cars, {
            title: 'NewCarsInTransactions',
            exclude: ['id'],
            optional: ['id']
          }),
        },
      },
    }) cars: Omit<Cars, 'id'>,
  ): Promise<Cars> {
    return this.transactionsRepository.cars(id).create(cars);
  }

  @patch('/transactions/{id}/cars', {
    responses: {
      '200': {
        description: 'Transactions.Cars PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cars, {partial: true}),
        },
      },
    })
    cars: Partial<Cars>,
    @param.query.object('where', getWhereSchemaFor(Cars)) where?: Where<Cars>,
  ): Promise<Count> {
    return this.transactionsRepository.cars(id).patch(cars, where);
  }

  @del('/transactions/{id}/cars', {
    responses: {
      '200': {
        description: 'Transactions.Cars DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Cars)) where?: Where<Cars>,
  ): Promise<Count> {
    return this.transactionsRepository.cars(id).delete(where);
  }
}
