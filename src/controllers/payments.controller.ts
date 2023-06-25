import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Payments} from '../models';
import {PaymentsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PaymentsPostSchema} from '../schemas/payments.schema';
import {IPaymentApiResponse} from '../utilities/types';
import {catchError} from '../utilities/helpers';

export class PaymentsController {
  constructor(
    @repository(PaymentsRepository)
    public paymentsRepository: PaymentsRepository,
  ) {}

  @authenticate('jwt')
  @post('/payments')
  @response(200, {
    description: 'Payments model instance',
    content: {'application/json': {schema: getModelSchemaRef(Payments)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: PaymentsPostSchema,
        },
      },
    })
    payments: Omit<Payments, 'id'>,
  ): Promise<IPaymentApiResponse> {
    return this.paymentsRepository
      .create(payments)
      .then(res => {
        return {status: 'success', message: 'Successfully added.', data: res};
      })
      .catch(error => catchError(error));
  }

  @get('/payments/count')
  @response(200, {
    description: 'Payments model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Payments) where?: Where<Payments>): Promise<Count> {
    return this.paymentsRepository.count(where);
  }

  @get('/payments')
  @response(200, {
    description: 'Array of Payments model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Payments, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Payments) filter?: Filter<Payments>,
  ): Promise<Payments[]> {
    return this.paymentsRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/payments')
  @response(200, {
    description: 'Payments PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, {partial: true}),
        },
      },
    })
    payments: Payments,
    @param.where(Payments) where?: Where<Payments>,
  ): Promise<Count> {
    return this.paymentsRepository.updateAll(payments, where);
  }

  @get('/payments/{id}')
  @response(200, {
    description: 'Payments model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Payments, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Payments, {exclude: 'where'})
    filter?: FilterExcludingWhere<Payments>,
  ): Promise<Payments> {
    return this.paymentsRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/payments/{id}')
  @response(204, {
    description: 'Payments PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payments, {partial: true}),
        },
      },
    })
    payments: Payments,
  ): Promise<void> {
    await this.paymentsRepository.updateById(id, payments);
  }

  @authenticate('jwt')
  @del('/payments/{id}')
  @response(204, {
    description: 'Payments DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.paymentsRepository.deleteById(id);
  }
}
