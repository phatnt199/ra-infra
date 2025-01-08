import {
  AnyType,
  CoreBindings,
  IAuthProviderOptions,
  IDataProvider,
  RequestMethods,
} from '@/common';
import { DefaultAuthService } from '@/services';
import { inject, ValueOrPromise } from '@loopback/context';
import { AuthProvider } from 'react-admin';
import { BaseProvider } from './base.provider';

export class DefaultAuthProvider extends BaseProvider<AuthProvider> {
  constructor(
    @inject(CoreBindings.DEFAULT_REST_DATA_PROVIDER)
    private restDataProvider: IDataProvider,
    @inject(CoreBindings.AUTH_PROVIDER_OPTIONS)
    private authProviderOptions: IAuthProviderOptions,
    @inject(CoreBindings.DEFAULT_AUTH_SERVICE)
    private authService: DefaultAuthService,
  ) {
    super();
  }

  // -------------------------------------------------------------
  // LOGIN
  // -------------------------------------------------------------
  login(params: AnyType) {
    return new Promise((resolve, reject) => {
      this.restDataProvider
        .send({
          resource: this.authProviderOptions.paths?.signIn ?? '/auth/login',
          params: { method: RequestMethods.POST, body: params },
        })
        .then(rs => {
          const { userId, token } = rs.data;
          this.authService.saveAuth({ token, userId, username: params.username });
          resolve(rs);
        })
        .catch(error => {
          console.log('[LOGIN]', error);
          reject(error);
        });
    });
  }

  // -------------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------------
  logout(_params: AnyType) {
    return new Promise<void>(resolve => {
      this.authService.cleanUp();
      resolve();
    });
  }

  // -------------------------------------------------------------
  // CHECK_AUTH
  // -------------------------------------------------------------
  async checkAuth(_params: AnyType) {
    const token = this.authService.getAuth();

    if (!token?.value) {
      return Promise.reject({ redirectTo: 'login' });
    }

    if (!this.authProviderOptions.paths?.checkAuth) {
      return Promise.resolve();
    }

    const rs = await this.restDataProvider.send({
      resource: this.authProviderOptions.paths.checkAuth,
      params: { method: RequestMethods.GET },
    });

    if (!rs?.data) {
      return Promise.reject({ redirectTo: 'login' });
    }

    return await Promise.resolve();
  }

  // -------------------------------------------------------------
  // CHECK_ERROR
  // -------------------------------------------------------------
  checkError(params: AnyType) {
    const { status } = params;

    if (status === 401) {
      this.authService.cleanUp();
      return Promise.reject({ redirectTo: 'login' });
    }

    if (status === 403) {
      return Promise.reject({
        redirectTo: `/unauthorized`,
        logoutUser: false,
      });
    }

    return Promise.resolve();
  }

  // -------------------------------------------------------------
  // GET_IDENTIFIER
  // -------------------------------------------------------------
  getIdentity(_params: AnyType) {
    const user = this.authService.getUser();

    if (!user?.userId) {
      return Promise.reject({ message: '[getIdentity] No userId to get user identity!' });
    }

    return Promise.resolve(user);
  }

  // -------------------------------------------------------------
  // GET_PERMISSIONS
  // -------------------------------------------------------------
  getPermissions(_params: AnyType) {
    return Promise.resolve();
  }

  // -------------------------------------------------------------
  override value(): ValueOrPromise<AuthProvider> {
    return {
      login: (params: AnyType) => this.login(params),
      logout: (params: AnyType) => this.logout(params),
      checkError: (params: AnyType) => this.checkError(params),
      checkAuth: (params: AnyType) => this.checkAuth(params),
      getIdentity: (params: AnyType) => this.getIdentity(params),
      getPermissions: (params: AnyType) => this.getPermissions(params),
    };
  }
}
