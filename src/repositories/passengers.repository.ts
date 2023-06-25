import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSourceDataSource} from '../datasources';
import {Passengers, PassengersRelations} from '../models';

export class PassengersRepository extends DefaultCrudRepository<
  Passengers,
  typeof Passengers.prototype.id,
  PassengersRelations
> {
  constructor(
    @inject('datasources.MysqlDataSource') dataSource: MysqlDataSourceDataSource,
  ) {
    super(Passengers, dataSource);
  }
}
