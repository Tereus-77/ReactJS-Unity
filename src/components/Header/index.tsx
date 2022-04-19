import React from 'react';
import Button from 'react-bootstrap/Button';

// Images
import Logo from '../../assets/images/Logo_solajump1.png'
// Utils
import { useTranslation } from 'react-i18next';

// Style
import './styles.scss';
import {
  shortenAddress,
} from "../../candy-machine";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import styled from "styled-components";


function Header() {
  const { t } = useTranslation();
  const ConnectButton = styled(WalletDialogButton)``;
  const wallet = useAnchorWallet();

  return <div className="header d-flex justify-content-between">
    <div className="logo">
      <div className="logo-section">
        <a href="/">
          <img src={Logo} alt="" />
        </a>
      </div>
    </div>
    {/* <div className="mint-button">
      <ConnectButton className="action-button">{wallet ? shortenAddress(wallet.publicKey.toBase58() || "") : t('header.button')}</ConnectButton>
      <div className="logo-title">{t('header.logo.sub-title')}</div>
      <div className="logo-title">{t('header.logo.sub-title-2')}</div>
    </div> */}
  </div>
}

export default Header;