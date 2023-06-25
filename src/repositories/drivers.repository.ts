import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSourceDataSource} from '../datasources';
import {Drivers, DriversRelations} from '../models';

export class DriversRepository extends DefaultCrudRepository<
  Drivers,
  typeof Drivers.prototype.id,
  DriversRelations
> {
  constructor(
    @inject('datasources.MysqlDataSource')
    dataSource: MysqlDataSourceDataSource,
  ) {
    super(Drivers, dataSource);

    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.updatedAt = new Date();
    });
  }
}
