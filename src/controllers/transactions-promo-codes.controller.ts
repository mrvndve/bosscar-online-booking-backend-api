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
  PromoCodes,
} from '../models';
import {TransactionsRepository} from '../repositories';

export class TransactionsPromoCodesController {
  constructor(
    @repository(TransactionsRepository) protected transactionsRepository: TransactionsRepository,
  ) { }

  @get('/transactions/{id}/promo-codes', {
    responses: {
      '200': {
        description: 'Transactions has one PromoCodes',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PromoCodes),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PromoCodes>,
  ): Promise<PromoCodes> {
    return this.transactionsRepository.promoCodes(id).get(filter);
  }

  @post('/transactions/{id}/promo-codes', {
    responses: {
      '200': {
        description: 'Transactions model instance',
        content: {'application/json': {schema: getModelSchemaRef(PromoCodes)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Transactions.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PromoCodes, {
            title: 'NewPromoCodesInTransactions',
            exclude: ['id'],
            optional: ['id']
          }),
        },
      },
    }) promoCodes: Omit<PromoCodes, 'id'>,
  ): Promise<PromoCodes> {
    return this.transactionsRepository.promoCodes(id).create(promoCodes);
  }

  @patch('/transactions/{id}/promo-codes', {
    responses: {
      '200': {
        description: 'Transactions.PromoCodes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PromoCodes, {partial: true}),
        },
      },
    })
    promoCodes: Partial<PromoCodes>,
    @param.query.object('where', getWhereSchemaFor(PromoCodes)) where?: Where<PromoCodes>,
  ): Promise<Count> {
    return this.transactionsRepository.promoCodes(id).patch(promoCodes, where);
  }

  @del('/transactions/{id}/promo-codes', {
    responses: {
      '200': {
        description: 'Transactions.PromoCodes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(PromoCodes)) where?: Where<PromoCodes>,
  ): Promise<Count> {
    return this.transactionsRepository.promoCodes(id).delete(where);
  }
}
