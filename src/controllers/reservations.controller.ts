import {
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
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Reservations} from '../models';
import {ReservationsRepository, TransactionsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  ReservationsGetConditions,
  ReservationsPostSchema,
  ReservationsDeleteMultipleConditions,
} from '../schemas/reservation.schema';
import {IReservationApiResponse, ICountApiResponse} from '../utilities/types';
import {catchError} from '../utilities/helpers';

export class ReservationsController {
  constructor(
    @repository(ReservationsRepository)
    public reservationsRepository: ReservationsRepository,
    @repository(TransactionsRepository)
    public transactionsRepository: TransactionsRepository,
  ) {}

  @post('/reservations')
  @response(200, {
    description: 'Reservations model instance',
    content: {'application/json': {schema: getModelSchemaRef(Reservations)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: ReservationsPostSchema,
        },
      },
    })
    reservations: Omit<Reservations, 'id'>,
  ): Promise<IReservationApiResponse> {
    return this.reservationsRepository
      .create(reservations)
      .then(res => {
        return {status: 'success', message: 'Successfully added.', data: res};
      })
      .catch(error => catchError(error));
  }

  @get('/reservations/count')
  @response(200, {
    description: 'Reservations model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Reservations) where?: Where<Reservations>,
  ): Promise<ICountApiResponse> {
    return this.reservationsRepository.count(where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/reservations')
  @response(200, {
    description: 'Array of Reservations model instances',
    content: {
      'application/json': {
        schema: ReservationsGetConditions,
      },
    },
  })
  async find(
    @param.filter(Reservations) filter?: Filter<Reservations>,
  ): Promise<IReservationApiResponse> {
    return this.reservationsRepository
      .find(filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', datas: res};
      })
      .catch(error => catchError(error));
  }

  @patch('/reservations')
  @response(200, {
    description: 'Reservations PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservations, {partial: true}),
        },
      },
    })
    reservations: Reservations,
    @param.where(Reservations) where?: Where<Reservations>,
  ): Promise<ICountApiResponse> {
    return this.reservationsRepository
      .updateAll(reservations, where)
      .then(res => {
        return {status: 'success', message: 'Successfully count.', data: res};
      });
  }

  @get('/reservations/{id}')
  @response(200, {
    description: 'Reservations model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Reservations, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Reservations, {exclude: 'where'})
    filter?: FilterExcludingWhere<Reservations>,
  ): Promise<IReservationApiResponse> {
    return this.reservationsRepository
      .findById(id, filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', data: res};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @patch('/reservations/{id}')
  @response(204, {
    description: 'Reservations PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservations, {partial: true}),
        },
      },
    })
    reservations: Reservations,
  ): Promise<IReservationApiResponse> {
    return this.reservationsRepository
      .updateById(id, reservations)
      .then(() => {
        return {status: 'success', message: 'Successfully patch.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/reservations/{id}')
  @response(204, {
    description: 'Reservations DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<IReservationApiResponse> {
    return this.reservationsRepository
      .deleteById(id)
      .then(() => {
        return {status: 'success', message: 'Successfully delete.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/reservations')
  @response(204, {
    description: 'Reservations DELETE Multiple success',
    content: {
      'application/json': {
        schema: ReservationsDeleteMultipleConditions,
      },
    },
  })
  async deleteMultiple(
    @param.where(Reservations) where?: Where<Reservations>,
  ): Promise<ICountApiResponse> {
    return this.reservationsRepository.deleteAll(where).then(res => {
      return {status: 'success', message: 'Successfully delete.', data: res};
    });
  }
}
