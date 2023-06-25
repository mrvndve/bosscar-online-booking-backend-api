import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
require('dotenv').config();

const config = {
  name: 'MysqlDataSource',
  connector: 'mysql',
  url: '',
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDataSourceDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'MysqlDataSource';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.MysqlDataSource', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
