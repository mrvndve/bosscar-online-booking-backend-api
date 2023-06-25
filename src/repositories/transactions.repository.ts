import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSourceDataSource} from '../datasources';
import {Transactions, TransactionsRelations, Users, Cars, PromoCodes, Payments, Passengers} from '../models';
import {UsersRepository} from './users.repository';
import {CarsRepository} from './cars.repository';
import {PromoCodesRepository} from './promo-codes.repository';
import {PaymentsRepository} from './payments.repository';
import {PassengersRepository} from './passengers.repository';

export class TransactionsRepository extends DefaultCrudRepository<
  Transactions,
  typeof Transactions.prototype.id,
  TransactionsRelations
> {
  public readonly users: HasOneRepositoryFactory<
    Users,
    typeof Transactions.prototype.id
  >;

  public readonly cars: HasOneRepositoryFactory<Cars, typeof Transactions.prototype.id>;

  public readonly promoCodes: HasOneRepositoryFactory<PromoCodes, typeof Transactions.prototype.id>;

  public readonly payments: HasManyRepositoryFactory<Payments, typeof Transactions.prototype.id>;

  public readonly passengers: HasManyRepositoryFactory<Passengers, typeof Transactions.prototype.id>;

  constructor(
    @inject('datasources.MysqlDataSource')
    dataSource: MysqlDataSourceDataSource,
    @repository.getter('UsersRepository')
    protected usersRepositoryGetter: Getter<UsersRepository>, @repository.getter('CarsRepository') protected carsRepositoryGetter: Getter<CarsRepository>, @repository.getter('PromoCodesRepository') protected promoCodesRepositoryGetter: Getter<PromoCodesRepository>, @repository.getter('PaymentsRepository') protected paymentsRepositoryGetter: Getter<PaymentsRepository>, @repository.getter('PassengersRepository') protected passengersRepositoryGetter: Getter<PassengersRepository>,
  ) {
    super(Transactions, dataSource);
    this.passengers = this.createHasManyRepositoryFactoryFor('passengers', passengersRepositoryGetter,);
    this.registerInclusionResolver('passengers', this.passengers.inclusionResolver);
    this.payments = this.createHasManyRepositoryFactoryFor('payments', paymentsRepositoryGetter,);
    this.registerInclusionResolver('payments', this.payments.inclusionResolver);
    this.promoCodes = this.createHasOneRepositoryFactoryFor('promoCodes', promoCodesRepositoryGetter);
    this.registerInclusionResolver('promoCodes', this.promoCodes.inclusionResolver);
    this.cars = this.createHasOneRepositoryFactoryFor('cars', carsRepositoryGetter);
    this.registerInclusionResolver('cars', this.cars.inclusionResolver);
    this.users = this.createHasOneRepositoryFactoryFor(
      'users',
      usersRepositoryGetter,
    );
    this.registerInclusionResolver('users', this.users.inclusionResolver);

    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.updatedAt = new Date();
    });
  }
}
