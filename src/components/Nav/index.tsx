import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { MAIN_MENU } from '../../constants/header-constants';

// Style
import './styles.scss';

function Nav({ location }) {
  const { t } = useTranslation();
  const currentSlug = location[1] ?? '';
  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  return <div className="main-menu ">
    <nav className="navbar navbar-display-lg navbar-dark">
      <button className={`navbar-toggler navbar-toggler-main d-none m-lg-block ${isActive ? 'show' : null}`} type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleClass} >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`collapse navbar-collapse ${isActive ? 'show' : null}`} id="navbarNav">
        <ul className="site-menu navbar-nav">
          <li className={currentSlug === "" ? "active" : ""}>
            <Link onClick={toggleClass} to={`${MAIN_MENU['menu-1'].slug}`}>{t(`nav.main.${MAIN_MENU['menu-1'].title}`)}</Link>
          </li>
        </ul>

      </div>
    </nav>
  </div>
}

export default Nav;
