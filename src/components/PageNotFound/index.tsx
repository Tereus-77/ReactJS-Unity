import React from 'react';
// Style
import './styles.scss';

// Utils
import { useTranslation } from 'react-i18next';

function PageNotFound() {
  const { t } = useTranslation();
  return <div className="page-wrapper">
    <div className="page-content text-center">
      <h1 className="text-center">{t('pages.PageNotFound.title')}</h1>
      <p className="para-large-margin">{t('pages.PageNotFound.line-1')}</p>
      <p className="para-large-margin">{t('pages.PageNotFound.line-2')}</p>
    </div>
  </div>
}

export default PageNotFound;