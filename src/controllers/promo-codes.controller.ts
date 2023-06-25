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
import {PromoCodes} from '../models';
import {PromoCodesRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  PromoCodesGetConditions,
  PromoCodesPostSchema,
  PromoCodesDeleteMultipleConditions,
  PromoCodesSearchSchema,
} from '../schemas/promo-codes.schemas';
import {
  IPromoCodeApiResponse,
  ICountApiResponse,
  IPromoCodeSearch,
} from '../utilities/types';
import {catchError} from '../utilities/helpers';

export class PromoCodesController {
  constructor(
    @repository(PromoCodesRepository)
    public promoCodesRepository: PromoCodesRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @post('/promo-codes')
  @response(200, {
    description: 'PromoCodes model instance',
    content: {'application/json': {schema: getModelSchemaRef(PromoCodes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: PromoCodesPostSchema,
        },
      },
    })
    promoCodes: Omit<PromoCodes, 'id'>,
  ): Promise<IPromoCodeApiResponse> {
    return this.promoCodesRepository
      .create(promoCodes)
      .then(res => {
        return {status: 'success', message: 'Successfully added.', data: res};
      })
      .catch(error => catchError(error));
  }

  @get('/promo-codes/count')
  @response(200, {
    description: 'PromoCodes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PromoCodes) where?: Where<PromoCodes>,
  ): Promise<ICountApiResponse> {
    return this.promoCodesRepository.count(where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/promo-codes')
  @response(200, {
    description: 'Array of PromoCodes model instances',
    content: {
      'application/json': {
        schema: PromoCodesGetConditions,
      },
    },
  })
  async find(
    @param.filter(PromoCodes) filter?: Filter<PromoCodes>,
  ): Promise<IPromoCodeApiResponse> {
    return this.promoCodesRepository
      .find(filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', datas: res};
      })
      .catch(error => catchError(error));
  }

  @patch('/promo-codes')
  @response(200, {
    description: 'PromoCodes PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PromoCodes, {partial: true}),
        },
      },
    })
    promoCodes: PromoCodes,
    @param.where(PromoCodes) where?: Where<PromoCodes>,
  ): Promise<ICountApiResponse> {
    return this.promoCodesRepository.updateAll(promoCodes, where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/promo-codes/{id}')
  @response(200, {
    description: 'PromoCodes model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PromoCodes, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PromoCodes, {exclude: 'where'})
    filter?: FilterExcludingWhere<PromoCodes>,
  ): Promise<IPromoCodeApiResponse> {
    return this.promoCodesRepository
      .findById(id, filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', data: res};
      })
      .catch(error => catchError(error));
  }

  @post('/promo-codes-search')
  @response(200, {
    description: 'Search Promo Code',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PromoCodes, {includeRelations: true}),
      },
    },
  })
  async findByCode(
    @requestBody({
      content: {
        'application/json': {
          schema: PromoCodesSearchSchema,
        },
      },
    })
    search: IPromoCodeSearch,
  ): Promise<IPromoCodeApiResponse> {
    return this.promoCodesRepository
      .find({
        where: {
          status: 'active',
          code: search.code,
          startDate: {lte: new Date().toLocaleString('en-PH')},
          endDate: {gte: new Date().toLocaleString('en-PH')},
        },
      })
      .then(res => {
        if (res.length > 0)
          return {
            status: 'success',
            message: 'Successfully fetch.',
            data: res[0],
          };
        else
          return {
            status: 'error',
            message: 'Code not found.',
          };
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @patch('/promo-codes/{id}')
  @response(204, {
    description: 'PromoCodes PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PromoCodes, {partial: true}),
        },
      },
    })
    promoCodes: PromoCodes,
  ): Promise<IPromoCodeApiResponse> {
    return this.promoCodesRepository
      .updateById(id, promoCodes)
      .then(() => {
        return {status: 'success', message: 'Successfully patch.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/promo-codes/{id}')
  @response(204, {
    description: 'PromoCodes DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<IPromoCodeApiResponse> {
    return this.promoCodesRepository
      .deleteById(id)
      .then(() => {
        return {status: 'success', message: 'Successfully delete.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/promo-codes')
  @response(204, {
    description: 'PromoCodes DELETE Multiple success',
    content: {
      'application/json': {
        schema: PromoCodesDeleteMultipleConditions,
      },
    },
  })
  async deleteMultiple(
    @param.where(PromoCodes) where?: Where<PromoCodes>,
  ): Promise<ICountApiResponse> {
    return this.promoCodesRepository.deleteAll(where).then(res => {
      return {status: 'success', message: 'Successfully delete.', data: res};
    });
  }
}
