import { CoreBindings, ValueOrPromise } from '@/common';
import { inject } from '@loopback/context';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { I18nProvider } from 'react-admin';
import { BaseProvider } from './base.provider';

const [language] = (navigator?.language || 'en-US').split('-');

export class DefaultI18nProvider extends BaseProvider<I18nProvider> {
  constructor(
    @inject(CoreBindings.I18N_SOURCES)
    private i18nSources: Record<string | symbol, any>,
  ) {
    super();
  }

  override value(): ValueOrPromise<I18nProvider> {
    return polyglotI18nProvider(
      locale => {
        return this.i18nSources?.[locale];
      },
      language,
      {
        allowMissing: true,
        onMissingKey: (key: string, _: any, __: any) => key,
      },
    );
  }
}
