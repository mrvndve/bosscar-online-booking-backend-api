import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSourceDataSource} from '../datasources';
import {Cars, CarsRelations} from '../models';

export class CarsRepository extends DefaultCrudRepository<
  Cars,
  typeof Cars.prototype.id,
  CarsRelations
> {
  constructor(
    @inject('datasources.MysqlDataSource')
    dataSource: MysqlDataSourceDataSource,
  ) {
    super(Cars, dataSource);

    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.updatedAt = new Date();
    });
  }
}
