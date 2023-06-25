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
import {Users} from '../models';
import {UserCredentialsRepository, UsersRepository} from '../repositories';
import {inject} from '@loopback/core';
import {
  Credentials,
  TokenServiceBindings,
  MyUserService,
  UserServiceBindings,
  UserRepository,
} from '@loopback/authentication-jwt';
import {authenticate, TokenService} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  IUserRegister,
  IUserApiResponse,
  ICountApiResponse,
  IUserForgotPassword,
  IUserChangePassword,
  IUserKyc,
} from '../utilities/types';
import {catchError, getRandomPassword} from '../utilities/helpers';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {
  UsersChangePasswordSchema,
  UsersDeleteMultipleConditions,
  UsersForgotPasswordSchema,
  UsersGetConditions,
  UsersKycSchema,
  UsersLoginSchema,
  UsersPostSchema,
  UsersRegisterSchema,
} from '../schemas';

export class UsersController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @post('/users')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: UsersPostSchema,
        },
      },
    })
    users: Omit<Users, 'id'>,
  ): Promise<IUserApiResponse> {
    return this.usersRepository
      .create(users)
      .then(async res => {
        const newPassword = getRandomPassword();
        const newPasswordHash = await hash(newPassword, await genSalt());
        await this.usersRepository
          .userCredentials(res.id)
          .create({password: newPasswordHash});
        return {
          status: 'success',
          message: `Successfully added. Password: ${newPassword}`,
          data: res,
        };
      })
      .catch(error => catchError(error));
  }

  @get('/users/count')
  @response(200, {
    description: 'Users model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Users) where?: Where<Users>,
  ): Promise<ICountApiResponse> {
    return this.usersRepository.count(where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/users')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: UsersGetConditions,
      },
    },
  })
  async find(
    @param.filter(Users) filter?: Filter<Users>,
  ): Promise<IUserApiResponse> {
    return this.usersRepository
      .find(filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', datas: res};
      })
      .catch(error => catchError(error));
  }

  @patch('/users')
  @response(200, {
    description: 'Users PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>,
  ): Promise<ICountApiResponse> {
    return this.usersRepository.updateAll(users, where).then(res => {
      return {status: 'success', message: 'Successfully count.', data: res};
    });
  }

  @get('/users/{id}')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Users, {exclude: 'where'})
    filter?: FilterExcludingWhere<Users>,
  ): Promise<IUserApiResponse> {
    return this.usersRepository
      .findById(id, filter)
      .then(res => {
        return {status: 'success', message: 'Successfully fetch.', data: res};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @patch('/users/{id}')
  @response(204, {
    description: 'Users PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
  ): Promise<IUserApiResponse> {
    return this.usersRepository
      .updateById(id, users)
      .then(() => {
        return {status: 'success', message: 'Successfully patch.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/users/{id}')
  @response(204, {
    description: 'Users DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<IUserApiResponse> {
    return this.usersRepository
      .deleteById(id)
      .then(() => {
        return {status: 'success', message: 'Successfully delete.'};
      })
      .catch(error => catchError(error));
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  @del('/users')
  @response(204, {
    description: 'Users DELETE Multiple success',
    content: {
      'application/json': {
        schema: UsersDeleteMultipleConditions,
      },
    },
  })
  async deleteMultiple(
    @param.where(Users) where?: Where<Users>,
  ): Promise<ICountApiResponse> {
    return this.usersRepository.deleteAll(where).then(res => {
      return {status: 'success', message: 'Successfully delete.', data: res};
    });
  }

  @post('/users/register')
  @response(200, {
    description: 'Users Registration',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: UsersRegisterSchema,
        },
      },
    })
    register: IUserRegister,
  ): Promise<IUserApiResponse> {
    const password = await hash(register.password, await genSalt());
    return this.usersRepository
      .create(_.omit(register, 'password'))
      .then(async user => {
        await this.usersRepository.userCredentials(user.id).create({password});
        return {
          status: 'success',
          message: 'Registration success.',
          users: [user],
        };
      })
      .catch(error => catchError(error));
  }

  /**
   * Users login
   */
  @post('/users/login')
  @response(200, {
    description: 'Users Login',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: UsersLoginSchema,
        },
      },
    })
    credentials: Credentials,
  ): Promise<IUserApiResponse> {
    return this.userService
      .verifyCredentials(credentials)
      .then(foundUser => this.userService.convertToUserProfile(foundUser))
      .then(async userProfile => {
        const token: string = await this.jwtService.generateToken(userProfile);
        const userData = await this.usersRepository.findById(userProfile.id);
        return {
          status: 'success',
          message: 'Valid user',
          token,
          data: userData,
        };
      })
      .catch(error => catchError(error));
  }

  /**
   * Users forgot password
   */
  @post('/users/forgot-password')
  @response(200, {
    description: 'Users Forgot Password',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async forgotPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: UsersForgotPasswordSchema,
        },
      },
    })
    phoneNumber: IUserForgotPassword,
  ): Promise<IUserApiResponse> {
    const users = await this.usersRepository.find({where: phoneNumber});
    if (users.length > 0) {
      const user = users[0];
      const newPassword = getRandomPassword();
      const newPasswordHash = await hash(newPassword, await genSalt());
      await this.userCredentialsRepository.deleteAll({userId: user.id});
      await this.usersRepository
        .userCredentials(user.id)
        .create({password: newPasswordHash});
      return {
        status: 'success',
        message: `New password : ${newPassword}`,
        data: user,
      };
    } else {
      return {status: 'error', message: 'Account not found.'};
    }
  }

  /**
   * Users change password
   */
  @authenticate('jwt')
  @post('/users/change-password')
  @response(200, {
    description: 'Users Change Password',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: UsersChangePasswordSchema,
        },
      },
    })
    changePassword: IUserChangePassword,
  ): Promise<IUserApiResponse> {
    if (changePassword.newPassword !== changePassword.confirmPassword)
      return {
        status: 'error',
        message: 'New and confirm password are not identical.',
      };

    const user = await this.usersRepository.findById(changePassword.userId);
    const adminLogin = user.role === 'admin' || user.role === 'sales';
    const credentials = {
      phoneNumber: user.phoneNumber,
      password: changePassword.oldPassword,
      adminLogin,
    };

    return this.userService
      .verifyCredentials(credentials)
      .then(async () => {
        await this.userCredentialsRepository.deleteAll({userId: user.id});
        const newPasswordHash = await hash(
          changePassword.newPassword,
          await genSalt(),
        );
        await this.usersRepository
          .userCredentials(user.id)
          .create({password: newPasswordHash});
        return {
          status: 'success',
          message: `Successfully change password.`,
          data: user,
        };
      })
      .catch(error => catchError(error));
  }

  /**
   * Users kyc
   */
  @authenticate('jwt')
  @post('/users/kyc')
  @response(200, {
    description: 'Users Change Password',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async kyc(
    @requestBody({
      content: {
        'application/json': {
          schema: UsersKycSchema,
        },
      },
    })
    kyc: IUserKyc,
  ): Promise<IUserApiResponse> {
    return this.usersRepository
      .updateById(kyc.userId, {
        idNo: kyc.idNo,
        idType: kyc.idType,
        idImagePath: kyc.idImagePath,
      })
      .then(() => {
        return {status: 'success', message: 'Successfully patch.'};
      })
      .catch(error => catchError(error));
  }
}
