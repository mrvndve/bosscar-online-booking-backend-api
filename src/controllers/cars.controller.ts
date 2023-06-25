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
import {Cars} from '../models';
import {CarsRepository, TransactionsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  CarsGetConditions,
  CarsPostSchema,
  CarsDeleteMultipleConditions,
  CarSearchSchema,
} from '../schemas/cars.schema';
import {
  ICarApiResponse,
  ICountApiResponse,
  ICarSearch,
} from '../utilities/types';
import {catchError} from '../utilities/helpers';

export class CarsController {
  constructor(
    @repository(CarsRepository)
    public carsRepository: CarsRepository,
    @repository(TransactionsRepository)
    public transactionsRepository: TransactionsRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @post('/cars')
  @response(200, {
    description: 'Cars model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cars)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: CarsPostSchema,
        },
      },
    })
    cars: Omit<Cars, 'id'>,
  ): Promise<ICarApiResponse> {
    return this.carsRepository
      .create(cars)
      .then(res => {
        return {status: 'success', message: 'Successfully added.', data: res};
      })
      .catch(error => catchError(error));
  }

  @get('/cars/count')
  @response(200, {
    description: 'Cars model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cars) where?: Where<Cars>,
  ): Promise<ICountApiResponse> {
    return this.carsRepository.count(where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/cars')
  @response(200, {
    description: 'Array of Cars model instances',
    content: {
      'application/json': {
        schema: CarsGetConditions,
      },
    },
  })
  async find(
    @param.filter(Cars) filter?: Filter<Cars>,
  ): Promise<ICarApiResponse> {
    return this.carsRepository
      .find(filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', datas: res};
      })
      .catch(error => catchError(error));
  }

  @patch('/cars')
  @response(200, {
    description: 'Cars PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cars, {partial: true}),
        },
      },
    })
    cars: Cars,
    @param.where(Cars) where?: Where<Cars>,
  ): Promise<ICountApiResponse> {
    return this.carsRepository.updateAll(cars, where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/cars/{id}')
  @response(200, {
    description: 'Cars model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cars, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Cars, {exclude: 'where'}) filter?: FilterExcludingWhere<Cars>,
  ): Promise<ICarApiResponse> {
    return this.carsRepository
      .findById(id, filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', data: res};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @patch('/cars/{id}')
  @response(204, {
    description: 'Cars PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cars, {partial: true}),
        },
      },
    })
    cars: Cars,
  ): Promise<ICarApiResponse> {
    return this.carsRepository
      .updateById(id, cars)
      .then(() => {
        return {status: 'success', message: 'Successfully patch.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/cars/{id}')
  @response(204, {
    description: 'Cars DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<ICarApiResponse> {
    return this.carsRepository
      .deleteById(id)
      .then(() => {
        return {status: 'success', message: 'Successfully delete.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/cars')
  @response(204, {
    description: 'Cars DELETE Multiple success',
    content: {
      'application/json': {
        schema: CarsDeleteMultipleConditions,
      },
    },
  })
  async deleteMultiple(
    @param.where(Cars) where?: Where<Cars>,
  ): Promise<ICountApiResponse> {
    return this.carsRepository.deleteAll(where).then(res => {
      return {status: 'success', message: 'Successfully delete.', data: res};
    });
  }

  @post('/cars-search')
  @response(200, {
    description: 'Array of Cars model instances',
  })
  async search(
    @requestBody({
      content: {
        'application/json': {
          schema: CarSearchSchema,
        },
      },
    })
    search: ICarSearch,
  ): Promise<ICarApiResponse> {
    const unavailableCarId: Array<number | undefined> = [];
    return this.transactionsRepository
      .find({
        fields: ['carId'],
        where: {
          or: [
            {
              and: [
                {pickUpDatetime: {lte: search.pickUpDatetime}},
                {returnDatetime: {gte: search.pickUpDatetime}},
              ],
            },
            {
              and: [
                {pickUpDatetime: {lte: search.returnDatetime}},
                {returnDatetime: {gte: search.returnDatetime}},
              ],
            },
          ],
        },
      })
      .then(transactions => {
        for (const transaction of transactions) {
          unavailableCarId.push(transaction.carId);
        }
        return unavailableCarId;
      })
      .then(unavailableCarIdResponse => {
        return this.carsRepository
          .find({
            where: {
              and: [{status: 'active'}, {id: {nin: unavailableCarIdResponse}}],
            },
          })
          .then(cars => {
            return {
              status: 'success',
              message: 'Successfully fetch available',
              datas: cars,
            };
          });
      })
      .catch(error => catchError(error));
  }
}
