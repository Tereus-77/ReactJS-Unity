import React from 'react';
// Style
import './styles.scss';

// Utils
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
  return <div className="page-wrapper">
    <div className="page-content">
      <h1 className="text-center">{t('pages.about.title')}</h1>
      <p className="para-large-margin">{t('pages.about.line-1')}</p>
      <p className="para-large-margin">{t('pages.about.line-2')}</p>
      <p className="para-large-margin">{t('pages.about.line-3')}</p>
    </div>
  </div>
}

export default About;