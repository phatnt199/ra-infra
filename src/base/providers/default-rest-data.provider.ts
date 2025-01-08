import {
  AnyType,
  CoreBindings,
  GetListVariants,
  ICustomParams,
  IDataProvider,
  IRestDataProviderOptions,
  ISendParams,
  RequestMethods,
  RequestTypes,
  TRequestMethod,
} from '@/common';
import { DefaultNetworkRequestService } from '@/services';
import { getError } from '@/utilities';
import { inject, ValueOrPromise } from '@loopback/context';
import {
  CreateParams,
  CreateResult,
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
import omit from 'lodash/omit';

export class DefaultRestDataProvider extends BaseProvider<IDataProvider> {
  private networkService: DefaultNetworkRequestService;

  constructor(
    @inject(CoreBindings.REST_DATA_PROVIDER_OPTIONS)
    private restDataProviderOptions: IRestDataProviderOptions,
  ) {
    super();

    this.networkService = new DefaultNetworkRequestService({
      name: 'default-application-network-service',
      baseUrl: this.restDataProviderOptions.url,
      noAuthPaths: this.restDataProviderOptions.noAuthPaths,
      getListVariant: this.restDataProviderOptions.getListVariant,
    });
  }

  // -------------------------------------------------------------
  // GET_LIST
  // -------------------------------------------------------------
  getList<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: GetListParams & QueryFunctionContext & ICustomParams;
  }): Promise<GetListResult<RecordType>> {
    const { resource, params } = _opts;
    const { pagination, sort, filter: filterGetList, meta, ...rest } = params;

    let filter: Record<string, AnyType> = {};

    if (filterGetList?.where) {
      filter = { ...filterGetList, where: filterGetList.where };
    } else {
      filter['where'] = {
        ...omit(filterGetList, ['include', 'params', 'noLimit', 'fields']),
      };
      filter['include'] = filterGetList?.include;
      filter['fields'] = filterGetList?.fields;
      filter['params'] = filterGetList?.params;
      filter['noLimit'] = filterGetList?.noLimit;
    }

    if (sort?.field) {
      filter['order'] = [`${sort.field} ${sort.order}`];
    }

    // Remove default limit and skip in react-admin
    if (filter?.noLimit) {
      filter['limit'] = undefined;
      filter['skip'] = undefined;
      filter['offset'] = undefined;
      filter['noLimit'] = undefined;
    } else {
      const { page = 0, perPage = 0 } = pagination ?? {};

      if (perPage >= 0) {
        filter['limit'] = perPage;
      }

      if (perPage > 0 && page >= 0) {
        filter['skip'] = (page - 1) * perPage;
        filter['offset'] = (page - 1) * perPage;
      }
    }

    for (const key in rest) {
      if (!params[key]) {
        continue;
      }
      filter[key] = params[key];
    }

    const queryKey: Record<string, AnyType> = {};

    if (filter?.params) {
      for (const key in filter.params) {
        queryKey[key] = filter.params[key];
      }
      filter['params'] = undefined;
    }

    if (meta) {
      for (const key in meta) {
        queryKey[key] = meta[key];
      }
    }

    const request = this.networkService.getRequestProps({ resource });

    const requestProps = {
      method: RequestMethods.GET as TRequestMethod,
      ...request,
    };

    const paths = [resource];

    const response = this.networkService.doRequest<RecordType[]>({
      type: RequestTypes.GET_LIST,
      paths,
      query: { ...queryKey, filter },
      ...requestProps,
    });

    if (this.networkService.getGetListVariant() === GetListVariants.CONTENT_RANGE) {
      return response;
    }

    const responseCount = this.networkService.doRequest({
      type: RequestTypes.SEND,
      paths: [resource, 'count'],
      query: { ...queryKey, where: filter?.where },
      ...requestProps,
    });

    const responseAll = Promise.all([response, responseCount]).then(
      (responses: AnyType[]) => {
        return {
          data: responses?.[0]?.data,
          total: responses?.[1]?.data?.count || 0,
        };
      },
    );

    return responseAll;
  }

  // -------------------------------------------------------------
  // GET_ONE
  // -------------------------------------------------------------
  getOne<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: GetOneParams<RecordType> & QueryFunctionContext & ICustomParams;
  }): Promise<GetOneResult<RecordType>> {
    const { resource, params } = _opts;

    const request = this.networkService.getRequestProps({ resource });
    const filter = params?.meta?.filter || {};
    const queryKey: Record<string, AnyType> = {};

    if (filter?.params) {
      for (const key in filter.params) {
        queryKey[key] = filter.params[key];
      }
    }

    const response = this.networkService.doRequest<RecordType>({
      type: RequestTypes.GET_ONE,
      method: RequestMethods.GET,
      query: { ...queryKey, filter: { ...omit(filter, 'params') } },
      paths: [resource, `${params.id}`],
      ...request,
    });

    return response;
  }

  // -------------------------------------------------------------
  // GET_MANY
  // -------------------------------------------------------------
  getMany<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: GetManyParams<RecordType> & QueryFunctionContext & ICustomParams;
  }): Promise<GetManyResult<RecordType>> {
    const { resource, params } = _opts;

    const request = this.networkService.getRequestProps({ resource });
    const filter = params?.meta?.filter || {};
    const queryKey: Record<string, AnyType> = {};

    if (filter?.params) {
      for (const key in filter.params) {
        queryKey[key] = filter.params[key];
      }
    }

    const response = this.networkService.doRequest<RecordType[]>({
      type: RequestTypes.GET_MANY,
      method: RequestMethods.GET,
      query: {
        ...queryKey,
        filter: {
          ...omit(filter, 'params'),
          where: { ...filter?.where, id: { inq: params.ids } },
        },
      },
      paths: [resource],
      ...request,
    });

    return response;
  }

  // -------------------------------------------------------------
  // GET_MANY_REFERENCE
  // -------------------------------------------------------------
  getManyReference<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: GetManyReferenceParams & QueryFunctionContext & ICustomParams;
  }): Promise<GetManyReferenceResult<RecordType>> {
    const { resource, params } = _opts;

    const { pagination, sort, filter: filterGetMany, meta, target, id, ...rest } = params;

    let filter: Record<string, AnyType> = {};

    if (filterGetMany?.where) {
      filter = { ...filterGetMany, where: { ...filterGetMany.where } };
    } else {
      filter['where'] = {
        ...omit(filterGetMany, ['include', 'params', 'noLimit', 'fields']),
      };
      filter['include'] = filterGetMany?.include;
      filter['fields'] = filterGetMany?.fields;
      filter['params'] = filterGetMany?.params;
      filter['noLimit'] = filterGetMany?.noLimit;
    }

    // Add target id to filter
    filter.where[target] = id;

    if (sort?.field) {
      filter['order'] = [`${sort.field} ${sort.order}`];
    }

    // Remove default limit and skip in react-admin
    if (filter?.noLimit) {
      filter['limit'] = undefined;
      filter['skip'] = undefined;
      filter['offset'] = undefined;
      filter['noLimit'] = undefined;
    } else {
      const { page = 0, perPage = 0 } = pagination;

      if (perPage >= 0) {
        filter['limit'] = perPage;
      }

      if (perPage > 0 && page >= 0) {
        filter['skip'] = (page - 1) * perPage;
        filter['offset'] = (page - 1) * perPage;
      }
    }

    for (const key in rest) {
      if (!params[key]) {
        continue;
      }
      filter[key] = params[key];
    }

    const queryKey: Record<string, AnyType> = {};

    if (filter?.params) {
      for (const key in filter.params) {
        queryKey[key] = filter.params[key];
      }
      filter['params'] = undefined;
    }

    if (meta) {
      for (const key in meta) {
        queryKey[key] = meta[key];
      }
    }

    const request = this.networkService.getRequestProps({ resource });

    const requestProps = {
      method: RequestMethods.GET as TRequestMethod,
      ...request,
    };

    const paths = [resource];

    const response = this.networkService.doRequest<RecordType[]>({
      type: RequestTypes.GET_MANY_REFERENCE,
      paths,
      query: { ...queryKey, filter },
      ...requestProps,
    });

    if (this.networkService.getGetListVariant() === GetListVariants.CONTENT_RANGE) {
      return response;
    }

    const responseCount = this.networkService.doRequest({
      type: RequestTypes.SEND,
      paths: [resource, 'count'],
      query: { ...queryKey, where: filter?.where },
      ...requestProps,
    });

    const responseAll = Promise.all([response, responseCount]).then(
      (responses: AnyType[]) => {
        return {
          data: responses?.[0]?.data,
          total: responses?.[1]?.data?.count || 0,
        };
      },
    );

    return responseAll;
  }

  // -------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------
  update<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: UpdateParams;
  }): Promise<UpdateResult<RecordType>> {
    const { resource, params } = _opts;

    const request = this.networkService.getRequestProps({
      resource,
      body: params.data,
    });

    const response = this.networkService.doRequest<RecordType>({
      type: RequestTypes.UPDATE,
      method: RequestMethods.PATCH,
      paths: [resource, `${params.id}`],
      ...request,
    });

    return response;
  }

  // -------------------------------------------------------------
  // UPDATE_MANY
  // -------------------------------------------------------------
  updateMany<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: UpdateManyParams;
  }): Promise<UpdateManyResult<RecordType>> {
    const { resource, params } = _opts;
    const { ids, data } = params;

    if (!ids.length) {
      throw getError({ message: '[updateMany] No IDs to execute update!' });
    }

    const request = this.networkService.getRequestProps({ resource, body: data });

    const response = this.networkService.doRequest<RecordType['id'][]>({
      type: RequestTypes.UPDATE_MANY,
      method: RequestMethods.PATCH,
      paths: [resource],
      query: { filter: { where: { id: { inq: ids } } } },
      ...request,
    });

    return response;
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
    const { resource, params } = _opts;

    const request = this.networkService.getRequestProps({ resource, body: params.data });

    const response = this.networkService.doRequest<ResultRecordType>({
      type: RequestTypes.CREATE,
      method: RequestMethods.POST,
      paths: [resource],
      ...request,
    });

    return response;
  }

  // -------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------
  delete<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: DeleteParams<RecordType>;
  }): Promise<DeleteResult<RecordType>> {
    const { resource, params } = _opts;

    const request = this.networkService.getRequestProps({ resource });

    const response = this.networkService.doRequest<RecordType>({
      type: RequestTypes.DELETE,
      method: RequestMethods.DELETE,
      paths: [resource, `${params.id}`],
      ...request,
    });

    return response;
  }

  // -------------------------------------------------------------
  // DELETE_MANY
  // -------------------------------------------------------------
  deleteMany<RecordType extends RaRecord = AnyType>(_opts: {
    resource: string;
    params: DeleteManyParams<RecordType>;
  }): Promise<DeleteManyResult<RecordType>> {
    const { resource, params } = _opts;

    const { ids } = params;

    if (!ids.length) {
      throw getError({ message: '[deleteMany] No IDs to execute delete!' });
    }

    const request = this.networkService.getRequestProps({ resource });

    const rs = Promise.all(
      ids
        .map(id => [resource, `${id}`])
        .map(paths => {
          return this.networkService.doRequest<RecordType['id']>({
            type: RequestTypes.DELETE_MANY,
            method: RequestMethods.DELETE,
            paths,
            ...request,
          });
        }),
    ).then(responses => {
      return {
        data: responses.map(response => response.data),
      };
    });

    return rs;
  }

  // -------------------------------------------------------------
  // SEND
  // -------------------------------------------------------------
  send<ReturnType = AnyType>(opts: {
    resource: string;
    params: ISendParams;
  }): Promise<{ data: ReturnType }> {
    const { resource, params } = opts;

    if (!params?.method) {
      throw getError({
        message: '[send] Invalid http method to send request!',
      });
    }

    const { method, query, ...rest } = params;

    const request = this.networkService.getRequestProps({ ...rest, resource });

    const response = this.networkService.doRequest<ReturnType>({
      type: RequestTypes.SEND,
      method,
      query,
      paths: [resource],
      ...request,
    });

    return response;
  }

  override value(): ValueOrPromise<IDataProvider> {
    return {
      getList: (resource, params) => {
        return this.getList({ resource, params });
      },
      getOne: (resource, params) => {
        return this.getOne({ resource, params });
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
