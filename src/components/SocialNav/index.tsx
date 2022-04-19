import React from 'react';

// Images
import discord from '../../assets/images/discord.svg';
import twitter from '../../assets/images/twitter.svg';

// Style
import './styles.scss';

// Utils
import { useTranslation } from 'react-i18next';


function SocialNav() {
  const { t } = useTranslation();
  return <ul className="social-menu">
    <li>
      <a target="_blank" href="https://discord.com/invite/qV2dhjYQcz" title="" rel="noreferrer"><img width="35" src={discord} alt="" /> {t('nav.social.discord')}</a>
    </li>
    <li>
      <a target="_blank" href="https://twitter.com/Sola_jump" title="" rel="noreferrer"><img width="35" src={twitter} alt="" /> {t('nav.social.twitter')}</a>
    </li>

  </ul>
}

export default SocialNav;
