import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSourceDataSource} from '../datasources';
import {Mops, MopsRelations} from '../models';

export class MopsRepository extends DefaultCrudRepository<
  Mops,
  typeof Mops.prototype.id,
  MopsRelations
> {
  constructor(
    @inject('datasources.MysqlDataSource')
    dataSource: MysqlDataSourceDataSource,
  ) {
    super(Mops, dataSource);

    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.updatedAt = new Date();
    });
  }
}
