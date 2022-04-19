import React from 'react';

//Images
import team1 from '../../assets/images/team/solajump_ex1.png';
import team2 from '../../assets/images/team/2.jpg'
import team3 from '../../assets/images/team/3-1.jpg'
import team4 from '../../assets/images/team/4.png'

// Style
import './styles.scss';

// Utils
import { useTranslation } from 'react-i18next';

function Team() {
  const { t } = useTranslation();
  return <div className="page-wrapper">
    <div className="page-content">
      <h1 className="text-center">{t('pages.team.title')}</h1>
      <div className="team">
        <div className="team-member d-flex">
          <div className="team-member-image"><img src={team1} alt=""></img></div>
          <div className="d-flex align-items-center">{t('pages.team.member.1')}</div>
        </div>
        <div className="team-member d-flex">
          <div className="team-member-image"><img src={team2} alt=""></img></div>
          <div className="d-flex align-items-center">{t('pages.team.member.2')}</div>
        </div>
        <div className="team-member d-flex">
          <div className="team-member-image"><img src={team3} alt=""></img></div>
          <div className="d-flex align-items-center">{t('pages.team.member.3')}</div>
        </div>
        <div className="team-member d-flex">
          <div className="team-member-image"><img src={team4} alt=""></img></div>
          <div className="d-flex align-items-center">{t('pages.team.member.4')}</div>
        </div>
      </div>
    </div>
  </div>
}

export default Team;