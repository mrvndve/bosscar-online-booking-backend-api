import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSourceDataSource} from '../datasources';
import {Payments, PaymentsRelations} from '../models';

export class PaymentsRepository extends DefaultCrudRepository<
  Payments,
  typeof Payments.prototype.id,
  PaymentsRelations
> {
  constructor(
    @inject('datasources.MysqlDataSource')
    dataSource: MysqlDataSourceDataSource,
  ) {
    super(Payments, dataSource);

    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.updatedAt = new Date();
    });
  }
}
