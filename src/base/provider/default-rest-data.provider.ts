import {
  AnyType,
  CoreBindings,
  IAuthProviderOptions,
  ICustomParams,
  IDataProvider,
  ISendParams,
  RequestTypes,
  ValueOrPromise,
} from '@/common';
import { DefaultNetworkRequestService } from '@/services';
import { getError } from '@/utilities';
import { inject } from '@loopback/context';
import {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  Identifier,
  QueryFunctionContext,
  RaRecord,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
} from 'react-admin';
import { BaseProvider } from './base.provider';

export class DefaultRestDataProvider extends BaseProvider<DataProvider> {
  private networkService: DefaultNetworkRequestService;

  constructor(
    @inject(CoreBindings.AUTH_PROVIDER_OPTIONS)
    private authProviderOptions: IAuthProviderOptions,
  ) {
    super();

    this.networkService = new DefaultNetworkRequestService({
      name: 'default-application-network-service',
      baseUrl: this.authProviderOptions.url,
      noAuthPaths: this.authProviderOptions.noAuthPaths,
    });
  }

  // -------------------------------------------------------------
  // GET_LIST
  // -------------------------------------------------------------
  getList<RecordType extends RaRecord = any>(_opts: {
    resource: string;
    params: GetListParams & QueryFunctionContext & ICustomParams;
  }): Promise<GetListResult<RecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // GET_ONE
  // -------------------------------------------------------------
  getOne<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: GetOneParams<RecordType> & QueryFunctionContext & ICustomParams;
  }): Promise<GetOneResult<RecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // GET_MANY
  // -------------------------------------------------------------
  getMany<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: GetManyParams<RecordType> & QueryFunctionContext & ICustomParams;
  }): Promise<GetManyResult<RecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // GET_MANY_REFERENCE
  // -------------------------------------------------------------
  getManyReference<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: GetManyReferenceParams & QueryFunctionContext & ICustomParams;
  }): Promise<GetManyReferenceResult<RecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------
  update<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: UpdateParams;
  }): Promise<UpdateResult<RecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // UPDATE_MANY
  // -------------------------------------------------------------
  updateMany<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: UpdateManyParams;
  }): Promise<UpdateManyResult<RecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------
  create<
    RecordType extends Omit<RaRecord, 'id'> = AnyType,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
  >(_opts: {
    resource: string;
    params: CreateParams;
  }): Promise<CreateResult<ResultRecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------
  delete<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: DeleteParams<RecordType>;
  }): Promise<DeleteResult<RecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // DELETE_MANY
  // -------------------------------------------------------------
  deleteMany<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: DeleteManyParams<RecordType>;
  }): Promise<DeleteManyResult<RecordType>> {
    throw getError({ message: '[getList] Method not implemented' });
  }

  // -------------------------------------------------------------
  // SEND
  // -------------------------------------------------------------
  send<ReturnType = any>(opts: { resource: string; params: ISendParams }) {
    const { resource, params } = opts;
    if (!params?.method) {
      throw getError({
        message: '[send] Invalid http method to send request!',
      });
    }

    const { method, query, ...rest } = params;

    const request = this.networkService.getRequestProps({ ...rest, resource });

    return this.networkService.doRequest<ReturnType>({
      type: RequestTypes.SEND,
      method,
      query,
      paths: [resource],
      ...request,
    });
  }

  override value(): ValueOrPromise<IDataProvider> {
    return {
      getOne: (resource, params) => {
        return this.getOne({ resource, params });
      },
      getList: (resource, params) => {
        return this.getList({ resource, params });
      },
      getMany: (resource, params) => {
        return this.getMany({ resource, params });
      },
      getManyReference: (resource, params) => {
        return this.getManyReference({ resource, params });
      },
      create: (resource, params) => {
        return this.create({ resource, params });
      },
      update: (resource, params) => {
        return this.update({ resource, params });
      },
      updateMany: (resource, params) => {
        return this.updateMany({ resource, params });
      },
      delete: (resource, params) => {
        return this.delete({ resource, params });
      },
      deleteMany: (resource, params) => {
        return this.deleteMany({ resource, params });
      },
      send: (opts: { resource: string; params: ISendParams }) => {
        return this.send(opts);
      },
    };
  }
}
