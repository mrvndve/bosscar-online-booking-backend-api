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
import {Passengers} from '../models';
import {PassengersRepository} from '../repositories';
import {catchError} from '../utilities/helpers';
import {IPassengerApiResponse} from '../utilities/types';
import {PassengersPostSchema} from '../schemas/passengers.schema';

export class PassengersController {
  constructor(
    @repository(PassengersRepository)
    public passengersRepository: PassengersRepository,
  ) {}

  @post('/passengers')
  @response(200, {
    description: 'Passengers model instance',
    content: {'application/json': {schema: getModelSchemaRef(Passengers)}},
  })
  async create(
    @requestBody()
    passengers: Passengers[],
  ): Promise<IPassengerApiResponse> {
    passengers.map(passenger => {
      this.passengersRepository
        .create(passenger)
        .catch(error => catchError(error));
    });

    return {status: 'success', message: 'Successfully added.'};
  }

  @get('/passengers/count')
  @response(200, {
    description: 'Passengers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Passengers) where?: Where<Passengers>,
  ): Promise<Count> {
    return this.passengersRepository.count(where);
  }

  @get('/passengers')
  @response(200, {
    description: 'Array of Passengers model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Passengers, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Passengers) filter?: Filter<Passengers>,
  ): Promise<Passengers[]> {
    return this.passengersRepository.find(filter);
  }

  @patch('/passengers')
  @response(200, {
    description: 'Passengers PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Passengers, {partial: true}),
        },
      },
    })
    passengers: Passengers,
    @param.where(Passengers) where?: Where<Passengers>,
  ): Promise<Count> {
    return this.passengersRepository.updateAll(passengers, where);
  }

  @get('/passengers/{id}')
  @response(200, {
    description: 'Passengers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Passengers, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Passengers, {exclude: 'where'})
    filter?: FilterExcludingWhere<Passengers>,
  ): Promise<Passengers> {
    return this.passengersRepository.findById(id, filter);
  }

  @patch('/passengers/{id}')
  @response(204, {
    description: 'Passengers PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Passengers, {partial: true}),
        },
      },
    })
    passengers: Passengers,
  ): Promise<IPassengerApiResponse> {
    return this.passengersRepository
      .updateById(id, passengers)
      .then(() => {
        return {status: 'success', message: 'Successfully patch.'};
      })
      .catch(error => catchError(error));
  }

  @put('/passengers/{id}')
  @response(204, {
    description: 'Passengers PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() passengers: Passengers,
  ): Promise<void> {
    await this.passengersRepository.replaceById(id, passengers);
  }

  @del('/passengers/{id}')
  @response(204, {
    description: 'Passengers DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<IPassengerApiResponse> {
    return this.passengersRepository
      .deleteById(id)
      .then(() => {
        return {status: 'success', message: 'Successfully delete.'};
      })
      .catch(error => catchError(error));
  }
}
