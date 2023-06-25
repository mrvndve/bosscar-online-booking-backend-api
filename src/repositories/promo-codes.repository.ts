import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSourceDataSource} from '../datasources';
import {PromoCodes, PromoCodesRelations} from '../models';

export class PromoCodesRepository extends DefaultCrudRepository<
  PromoCodes,
  typeof PromoCodes.prototype.id,
  PromoCodesRelations
> {
  constructor(
    @inject('datasources.MysqlDataSource')
    dataSource: MysqlDataSourceDataSource,
  ) {
    super(PromoCodes, dataSource);

    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.updatedAt = new Date();
    });
  }
}
