import {
  CoreBindings,
  IAuthProviderOptions,
  IDataProvider,
  RequestMethods,
  ValueOrPromise,
} from '@/common';
import { DefaultAuthService } from '@/services';
import { inject } from '@loopback/context';
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

  login(params: any) {
    return new Promise((resolve, reject) => {
      this.restDataProvider
        .send({
          resource: this.authProviderOptions.paths?.signIn ?? '/auth/login',
          params: {
            method: RequestMethods.POST,
            body: {
              identifier: { scheme: 'username', value: params.username },
              credential: { scheme: 'basic', value: params.password },
            },
          },
        })
        .then(rs => {
          const { userId, token } = rs.data;
          this.authService.saveAuth({ token, userId, username: params.username });
          resolve(rs);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  logout(_params: any) {
    return new Promise<void>(resolve => {
      this.authService.cleanUp();
      resolve();
    });
  }

  checkError(params: any) {
    const { status } = params;
    if (status === 401 || status === 403) {
      // authService.cleanUpAuth();
      return Promise.reject({ redirectTo: 'login' });
    }

    return Promise.resolve();
  }

  async checkAuth(_params: any) {
    const token = this.authService.getAuth();
    if (!token?.value) {
      return Promise.reject({ redirectTo: 'login' });
    }

    const rs = await this.restDataProvider.send({
      resource: this.authProviderOptions.paths?.checkAuth ?? 'auth/who-am-i',
      params: { method: RequestMethods.GET },
    });

    if (!rs?.data?.userId) {
      return Promise.reject({ redirectTo: 'login' });
    }
    return await Promise.resolve();
  }

  getIdentity(_params: any) {
    const user = this.authService.getUser();
    return Promise.resolve({
      id: 0,
      fullName: 'N/A',
      username: user?.username ?? '',
    });
  }

  getPermissions(_params: any) {
    return Promise.resolve();
  }

  override value(): ValueOrPromise<AuthProvider> {
    return {
      login: (params: any) => this.login(params),
      logout: (params: any) => this.logout(params),
      checkError: (params: any) => this.checkError(params),
      checkAuth: (params: any) => this.checkAuth(params),
      getIdentity: (params: any) => this.getIdentity(params),
      getPermissions: (params: any) => this.getPermissions(params),
    };
  }
}
