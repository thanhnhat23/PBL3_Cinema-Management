import i18n from 'i18next';

import viCommon from '../locales/vi/common.json';
import jaCommon from '../locales/ja/common.json';
import enCommon from '../locales/en/common.json';

export const resources = {
  vi: { common: viCommon },
  ja: { common: jaCommon },
  en: { common: enCommon }
};

export const i18nConfig = {
  resources,
  fallbackLng: 'vi',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
};

export default i18n;
