import React from 'react';
// Style
import './styles.scss';

// Utils
import { useTranslation } from 'react-i18next';

function Content4() {
  const { t } = useTranslation();
  return <div className="page-wrapper">
    <div className="page-content">
      <h1 className="text-center">{t('pages.content4.title')}</h1>
      <div className="story">

      </div>
    </div>
  </div>
}

export default Content4;