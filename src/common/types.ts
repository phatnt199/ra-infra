import { BindingTag, Constructor, DynamicValueProviderClass } from '@loopback/context';
import {
  Environments,
  GetListVariants,
  RequestBodyTypes,
  RequestMethods,
  RequestTypes,
} from './constants';
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

// ----------------------------------------------------------------------------------------------------------------------------------------
export type NumberIdType = number;
export type StringIdType = string;
export type IdType = string | number;
export type NullableType = undefined | null | void;

export type AnyType = any;
export type AnyObject = Record<string | symbol | number, any>;

export type ValueOrPromise<T> = T | Promise<T>;
export type ValueOf<T> = T[keyof T];

export type ValueOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type ValueOptionalExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

/**
 * Alias for {@link ValueOf<T>}
 */
export type ClassProps<T> = ValueOf<T>;
export type ClassType<T> = Function & { prototype: T };

export type TStatusFromClass<T extends ClassType<AnyObject>> = ValueOf<
  Omit<T, 'prototype' | 'isValid' | 'SCHEME_SET'>
>;

//-----------------------------------------------------------
export type TRequestMethod = TStatusFromClass<typeof RequestMethods>;
export type TEnvironment = TStatusFromClass<typeof Environments>;

//-----------------------------------------------------------
export interface IRequestProps {
  headers?: { [key: string]: string | number };
  body?: any;
  query?: any;
}

export interface ISendParams {
  id?: string | number;
  method?: TRequestMethod;
  bodyType?: TRequestBodyType;
  body?: any;
  file?: any;
  query?: { [key: string]: any };
  headers?: { [key: string]: string | number };
}

export type TRequestBodyType = Extract<ValueOf<typeof RequestBodyTypes>, string>;
export type TRequestType = Extract<ValueOf<typeof RequestTypes>, string>;
export type TGetListVariant = Extract<ValueOf<typeof GetListVariants>, string>;

export interface IGetRequestPropsParams {
  resource: string;
  body?: any;
  file?: File;
  bodyType?: TRequestBodyType;
}

export interface IGetRequestPropsResult {
  headers?: HeadersInit;
  body?: any;
}

export interface ICustomParams {
  params?: Record<string, AnyType>;
  [key: string]: AnyType;
}

export interface IReactAdminDataProvider {
  getList: <RecordType extends RaRecord = AnyType>(
    resource: string,
    params: GetListParams & QueryFunctionContext & ICustomParams,
  ) => Promise<GetListResult<RecordType>>;

  getOne: <RecordType extends RaRecord = AnyType>(
    resource: string,
    params: GetOneParams<RecordType> & QueryFunctionContext & ICustomParams,
  ) => Promise<GetOneResult<RecordType>>;

  getMany: <RecordType extends RaRecord = AnyType>(
    resource: string,
    params: GetManyParams<RecordType> & QueryFunctionContext & ICustomParams,
  ) => Promise<GetManyResult<RecordType>>;

  getManyReference: <RecordType extends RaRecord = AnyType>(
    resource: string,
    params: GetManyReferenceParams & QueryFunctionContext & ICustomParams,
  ) => Promise<GetManyReferenceResult<RecordType>>;

  update: <RecordType extends RaRecord = AnyType>(
    resource: string,
    params: UpdateParams,
  ) => Promise<UpdateResult<RecordType>>;

  updateMany: <RecordType extends RaRecord = AnyType>(
    resource: string,
    params: UpdateManyParams,
  ) => Promise<UpdateManyResult<RecordType>>;

  create: <
    RecordType extends Omit<RaRecord, 'id'> = AnyType,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
  >(
    resource: string,
    params: CreateParams,
  ) => Promise<CreateResult<ResultRecordType>>;

  delete: <RecordType extends RaRecord = AnyType>(
    resource: string,
    params: DeleteParams<RecordType>,
  ) => Promise<DeleteResult<RecordType>>;

  deleteMany: <RecordType extends RaRecord = AnyType>(
    resource: string,
    params: DeleteManyParams<RecordType>,
  ) => Promise<DeleteManyResult<RecordType>>;
}

export interface IDataProvider extends IReactAdminDataProvider {
  send: (opts: { resource: string; params: ISendParams }) => Promise<AnyType>;
}

// ----------------------------------------------------------------------
export interface IAuthProviderOptions {
  url: string;
  noAuthPaths: Array<string>;
  paths?: {
    signIn?: string;
    signUp?: string;
    checkAuth?: string;
  };
}

// ----------------------------------------------------------------------
export interface IService {}

// ----------------------------------------------------------------------
export interface IRaApplication {
  preConfigure(): ValueOrPromise<void>;
  postConfigure(): ValueOrPromise<void>;
  bindContext(): ValueOrPromise<void>;

  // ------------------------------------------------------------------------------
  injectable<T>(
    scope: string,
    value: DynamicValueProviderClass<T> | Constructor<T>,
    tags?: Array<BindingTag>,
  ): void;
  service<T>(value: DynamicValueProviderClass<T> | Constructor<T>): void;

  // ------------------------------------------------------------------------------
  start(): ValueOrPromise<void>;
}
