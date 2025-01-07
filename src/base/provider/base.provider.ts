import { ValueOrPromise } from '@/common';
import { Provider } from '@loopback/context';

export abstract class BaseProvider<T> implements Provider<T> {
  abstract value(): ValueOrPromise<T>;
}
