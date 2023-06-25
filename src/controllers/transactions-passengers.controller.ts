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
  Passengers,
} from '../models';
import {TransactionsRepository} from '../repositories';

export class TransactionsPassengersController {
  constructor(
    @repository(TransactionsRepository) protected transactionsRepository: TransactionsRepository,
  ) { }

  @get('/transactions/{id}/passengers', {
    responses: {
      '200': {
        description: 'Array of Transactions has many Passengers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Passengers)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Passengers>,
  ): Promise<Passengers[]> {
    return this.transactionsRepository.passengers(id).find(filter);
  }

  @post('/transactions/{id}/passengers', {
    responses: {
      '200': {
        description: 'Transactions model instance',
        content: {'application/json': {schema: getModelSchemaRef(Passengers)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Transactions.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Passengers, {
            title: 'NewPassengersInTransactions',
            exclude: ['id'],
            optional: ['transactionId']
          }),
        },
      },
    }) passengers: Omit<Passengers, 'id'>,
  ): Promise<Passengers> {
    return this.transactionsRepository.passengers(id).create(passengers);
  }

  @patch('/transactions/{id}/passengers', {
    responses: {
      '200': {
        description: 'Transactions.Passengers PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Passengers, {partial: true}),
        },
      },
    })
    passengers: Partial<Passengers>,
    @param.query.object('where', getWhereSchemaFor(Passengers)) where?: Where<Passengers>,
  ): Promise<Count> {
    return this.transactionsRepository.passengers(id).patch(passengers, where);
  }

  @del('/transactions/{id}/passengers', {
    responses: {
      '200': {
        description: 'Transactions.Passengers DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Passengers)) where?: Where<Passengers>,
  ): Promise<Count> {
    return this.transactionsRepository.passengers(id).delete(where);
  }
}
