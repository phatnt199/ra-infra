import { AnyType } from '@/common/types';
import { isDefined, isString } from './boolean.utility';

export const getNumberValue = <
  TResult extends TDefaultValue extends number ? number : TDefaultValue,
  TDefaultValue extends number | undefined | null = number | undefined,
>(opts: {
  value: AnyType;
  defaultValue?: TDefaultValue;
}) => {
  const { value, defaultValue } = opts;
  return (isDefined(value) && !isNaN(+value) ? +value : defaultValue) as TResult;
};

export const getStringValue = <
  TResult extends TDefaultValue extends string ? string : TDefaultValue,
  TDefaultValue extends string | undefined | null = string | undefined,
>(opts: {
  value: AnyType;
  defaultValue?: TDefaultValue;
  ignoreEmptyString?: boolean;
}) => {
  const { value, defaultValue, ignoreEmptyString = true } = opts;
  return (
    (ignoreEmptyString ? isDefined(value) : !value) && isString(value)
      ? value.trim()
      : defaultValue
  ) as TResult;
};
