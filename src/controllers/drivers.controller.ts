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
import {Drivers} from '../models';
import {DriversRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  DriversGetConditions,
  DriversPostSchema,
  DriversDeleteMultipleConditions,
} from '../schemas/drivers.schema';
import {IDriverApiResponse, ICountApiResponse} from '../utilities/types';
import {catchError} from '../utilities/helpers';

export class DriversController {
  constructor(
    @repository(DriversRepository)
    public driversRepository: DriversRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @post('/drivers')
  @response(200, {
    description: 'Drivers model instance',
    content: {'application/json': {schema: getModelSchemaRef(Drivers)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: DriversPostSchema,
        },
      },
    })
    drivers: Omit<Drivers, 'id'>,
  ): Promise<IDriverApiResponse> {
    return this.driversRepository
      .create(drivers)
      .then(res => {
        return {status: 'success', message: 'Successfully added.', data: res};
      })
      .catch(error => catchError(error));
  }

  @get('/drivers/count')
  @response(200, {
    description: 'Drivers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Drivers) where?: Where<Drivers>,
  ): Promise<ICountApiResponse> {
    return this.driversRepository.count(where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/drivers')
  @response(200, {
    description: 'Array of Drivers model instances',
    content: {
      'application/json': {
        schema: DriversGetConditions,
      },
    },
  })
  async find(
    @param.filter(Drivers) filter?: Filter<Drivers>,
  ): Promise<IDriverApiResponse> {
    return this.driversRepository
      .find(filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', datas: res};
      })
      .catch(error => catchError(error));
  }

  @patch('/drivers')
  @response(200, {
    description: 'Drivers PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Drivers, {partial: true}),
        },
      },
    })
    drivers: Drivers,
    @param.where(Drivers) where?: Where<Drivers>,
  ): Promise<ICountApiResponse> {
    return this.driversRepository.updateAll(drivers, where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/drivers/{id}')
  @response(200, {
    description: 'Drivers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Drivers, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Drivers, {exclude: 'where'})
    filter?: FilterExcludingWhere<Drivers>,
  ): Promise<IDriverApiResponse> {
    return this.driversRepository
      .findById(id, filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', data: res};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @patch('/drivers/{id}')
  @response(204, {
    description: 'Drivers PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Drivers, {partial: true}),
        },
      },
    })
    drivers: Drivers,
  ): Promise<IDriverApiResponse> {
    return this.driversRepository
      .updateById(id, drivers)
      .then(() => {
        return {status: 'success', message: 'Successfully patch.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/drivers/{id}')
  @response(204, {
    description: 'Drivers DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<IDriverApiResponse> {
    return this.driversRepository
      .deleteById(id)
      .then(() => {
        return {status: 'success', message: 'Successfully delete.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/drivers')
  @response(204, {
    description: 'Drivers DELETE Multiple success',
    content: {
      'application/json': {
        schema: DriversDeleteMultipleConditions,
      },
    },
  })
  async deleteMultiple(
    @param.where(Drivers) where?: Where<Drivers>,
  ): Promise<ICountApiResponse> {
    return this.driversRepository.deleteAll(where).then(res => {
      return {status: 'success', message: 'Successfully delete.', data: res};
    });
  }
}
