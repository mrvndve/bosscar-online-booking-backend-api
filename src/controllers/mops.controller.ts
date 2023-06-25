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
import {Mops} from '../models';
import {MopsRepository} from '../repositories';

export class MopsController {
  constructor(
    @repository(MopsRepository)
    public mopsRepository : MopsRepository,
  ) {}

  @post('/mops')
  @response(200, {
    description: 'Mops model instance',
    content: {'application/json': {schema: getModelSchemaRef(Mops)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mops, {
            title: 'NewMops',
            exclude: ['id'],
          }),
        },
      },
    })
    mops: Omit<Mops, 'id'>,
  ): Promise<Mops> {
    return this.mopsRepository.create(mops);
  }

  @get('/mops/count')
  @response(200, {
    description: 'Mops model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Mops) where?: Where<Mops>,
  ): Promise<Count> {
    return this.mopsRepository.count(where);
  }

  @get('/mops')
  @response(200, {
    description: 'Array of Mops model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Mops, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Mops) filter?: Filter<Mops>,
  ): Promise<Mops[]> {
    return this.mopsRepository.find(filter);
  }

  @patch('/mops')
  @response(200, {
    description: 'Mops PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mops, {partial: true}),
        },
      },
    })
    mops: Mops,
    @param.where(Mops) where?: Where<Mops>,
  ): Promise<Count> {
    return this.mopsRepository.updateAll(mops, where);
  }

  @get('/mops/{id}')
  @response(200, {
    description: 'Mops model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Mops, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Mops, {exclude: 'where'}) filter?: FilterExcludingWhere<Mops>
  ): Promise<Mops> {
    return this.mopsRepository.findById(id, filter);
  }

  @patch('/mops/{id}')
  @response(204, {
    description: 'Mops PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mops, {partial: true}),
        },
      },
    })
    mops: Mops,
  ): Promise<void> {
    await this.mopsRepository.updateById(id, mops);
  }

  @put('/mops/{id}')
  @response(204, {
    description: 'Mops PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() mops: Mops,
  ): Promise<void> {
    await this.mopsRepository.replaceById(id, mops);
  }

  @del('/mops/{id}')
  @response(204, {
    description: 'Mops DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.mopsRepository.deleteById(id);
  }
}
