import React from 'react';
// Style
import './styles.scss';

// Utils
import { useTranslation } from 'react-i18next';

function Faq() {
  const { t } = useTranslation();
  return <div className="page-wrapper">
    <div className="page-content">
      <h1 className="text-center">{t('pages.faq.title')}</h1>
      <div className="qna">
        <h4 className="alt-font">{t('pages.faq.1.ques')}</h4>
        <p className="para-large-margin fst-italic">{t('pages.faq.1.ans')}</p>
      </div>
      <div className="qna">
        <h4 className="alt-font">{t('pages.faq.2.ques')}</h4>
        <p className="para-large-margin fst-italic">{t('pages.faq.2.ans')}</p>
      </div>
      <div className="qna">
        <h4 className="alt-font">{t('pages.faq.3.ques')}</h4>
        <p className="para-large-margin fst-italic">{t('pages.faq.3.ans')}</p>
      </div>
    </div>
  </div>
}

export default Faq;