import React from 'react';

// Style
import './styles.scss';

// Utils
import { useTranslation } from 'react-i18next';

function Content3() {
  const { t } = useTranslation();
  return <div className="page-wrapper">
    <div className="page-content">
      <h1 className="text-center">{t('pages.content3.title')}</h1>
      <div className="d-flex justify-content-between">

      </div>

    </div>
  </div>
}

export default Content3;