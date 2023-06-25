// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/authentication-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserService} from '@loopback/authentication';
import {UserCredentials} from '@loopback/authentication-jwt';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import {Users, UsersWithRelations} from '../models';
import {UsersRepository} from '../repositories';

/**
 * A pre-defined type for user credentials. It assumes a user logs in
 * using the email and password. You can modify it if your app has different credential fields
 */
export type Credentials = {
  phoneNumber: string;
  password: string;
  adminLogin: boolean;
};

export class CustomUserService implements UserService<Users, Credentials> {
  constructor(
    @repository(UsersRepository) public usersRepository: UsersRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Users> {
    const invalidCredentialsError = 'Invalid credentials.';
    let foundUser: Users | null;
    let credentialsFound: UserCredentials | undefined;

    foundUser = await this.usersRepository.findOne({
      where: {phoneNumber: credentials.phoneNumber},
    });

    if (foundUser) {
      if (foundUser?.status === 'inactive') {
        throw new HttpErrors.Unauthorized('Account is currently inactive.');
      }

      if (
        !['admin', 'sales'].includes(foundUser.role) &&
        credentials.adminLogin
      ) {
        throw new HttpErrors.Unauthorized('Unauthorize login.');
      }

      credentialsFound = await this.usersRepository.findCredentials(
        foundUser.id,
      );
    } else {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await compare(
      credentials.password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: Users): UserProfile {
    return {
      [securityId]: user.phoneNumber.toString(),
      id: user.id,
      email: user.phoneNumber,
      name: user.role,
    };
  }

  //function to find user by id
  async findUserById(id: number): Promise<Users & UsersWithRelations> {
    const userNotfound = 'invalid User';
    const foundUser = await this.usersRepository.findById(id);

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }
    return foundUser;
  }

  async findUserByPhoneNumber(
    phoneNumber: string,
  ): Promise<Users & UsersWithRelations> {
    const userNotfound = 'invalid User';
    const foundUser = await this.usersRepository.find({
      where: {phoneNumber: phoneNumber},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }

    return foundUser[0];
  }
}
