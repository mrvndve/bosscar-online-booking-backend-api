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
  Users,
} from '../models';
import {TransactionsRepository} from '../repositories';

export class TransactionsUsersController {
  constructor(
    @repository(TransactionsRepository) protected transactionsRepository: TransactionsRepository,
  ) { }

  @get('/transactions/{id}/users', {
    responses: {
      '200': {
        description: 'Transactions has one Users',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Users),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Users>,
  ): Promise<Users> {
    return this.transactionsRepository.users(id).get(filter);
  }

  @post('/transactions/{id}/users', {
    responses: {
      '200': {
        description: 'Transactions model instance',
        content: {'application/json': {schema: getModelSchemaRef(Users)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Transactions.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsersInTransactions',
            exclude: ['id'],
            optional: ['id']
          }),
        },
      },
    }) users: Omit<Users, 'id'>,
  ): Promise<Users> {
    return this.transactionsRepository.users(id).create(users);
  }

  @patch('/transactions/{id}/users', {
    responses: {
      '200': {
        description: 'Transactions.Users PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Partial<Users>,
    @param.query.object('where', getWhereSchemaFor(Users)) where?: Where<Users>,
  ): Promise<Count> {
    return this.transactionsRepository.users(id).patch(users, where);
  }

  @del('/transactions/{id}/users', {
    responses: {
      '200': {
        description: 'Transactions.Users DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Users)) where?: Where<Users>,
  ): Promise<Count> {
    return this.transactionsRepository.users(id).delete(where);
  }
}
