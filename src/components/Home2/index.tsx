import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
// Components
import Quote from '../Quote/index'

// Style
import './styles.scss';

// Assets
// import videoMp4 from ''

// Utils
import { useTranslation } from 'react-i18next';

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import styled from "styled-components";

import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  mintMultipleToken,
  shortenAddress,
} from "../../candy-machine";

import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getMintId } from '../Firebase/firebase';
import { Redirect } from 'react-router';
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

export interface Home2Props {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
  setAlertSetting:any;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const MAX_MINT_COUNT = 10;

const CounterText = styled.span``; // add your styles here
const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};


const Home2 = (props: Home2Props) => {
  const ConnectButton = styled(WalletDialogButton)``;
  const { t } = useTranslation();
  const wallet = useAnchorWallet();
  const MintButton = styled(Button)``; // add your styles here
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [mintCount, setMintCount] = useState(1);
  const [walletConnected, setWalletConnected] = useState(false);
  const [mintSuccessFlag, setMintSuccessFlag] = useState(false);

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [balance, setBalance] = useState<number>();

  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => { // onMint is activated when the button is activated.. 
    let multiTokenState:any;
    let mintSuccessFlag = true;
    let alertMessage = "";
    props.setAlertSetting({
      open: true,
      message: `Minting for ${mintCount} tokens ...`,
      severity: "info",
    });
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        multiTokenState = await mintMultipleToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury,
          mintCount,
        );
        const status = await awaitTransactionSignatureConfirmation(
          multiTokenState.mintTxID,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );
      }
      setMintSuccessFlag(true);
    } catch (error: any) {
      // TODO: blech:
      mintSuccessFlag = false;
      alertMessage = error || "Minting failed! Please try again!";
      if (!error) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          alertMessage = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          alertMessage = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          alertMessage = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          alertMessage = `Minting period hasn't started yet.`;
        }
      }
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      if(multiTokenState !== undefined){
        for await (const mintAddr of multiTokenState.mintAddresses){
          await getMintId(mintAddr[0].publicKey.toBase58(), wallet?.publicKey.toBase58());
        }
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
    // console.log("onMint 9")
    // if(mintSuccessFlag == true) {
    //   props.setAlertSetting({
    //     open: true,
    //     message: "Successed",
    //     severity: "success",
    //   });
    // } else {
    //   props.setAlertSetting({
    //     open: true,
    //     message: alertMessage,
    //     severity: "error",
    //   });
    // }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        setWalletConnected(true);
        const balance = await props.connection.getBalance(wallet.publicKey);
        console.log(balance);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  const onClickMinusCounter = () => {
    let count = mintCount;
    setMintCount(count > 1  ? count - 1 : count)
  }

  const onClickPlusCounter = () => {
    let count = mintCount;
    setMintCount(count < MAX_MINT_COUNT  ? count + 1 : count)
  }

  // if(walletConnected === false && wallet?.publicKey === undefined){
  //   console.log("redirect to /login page");
  //   return (<Redirect to="/login" />);
  // }
  if(mintSuccessFlag === true){
    return (<Redirect to="/login" />);
  }
  return <div className="page-wrapper ">
      <div className="page-content" style={{textAlign:"center", paddingRight:"20px", paddingTop:"20px"}}>
        {
          <>
          <ConnectButton className="action-button">{wallet?shortenAddress(wallet?.publicKey?.toBase58() || "") : t('header.button')}</ConnectButton>
          <br />
          <Link to="/login">
            <button className="btn-hover-outline">Enter Game</button>
          </Link>
          </>
        }
        <br/>
      </div>
    <div className="page-content text-center">
      <h1>{t('pages.home.title')}</h1>
      <p>{t('pages.home.line-5')}</p>
      {wallet && (
        <>
          {(!isSoldOut || isActive) && (
            <div className="mint-image-counter">
              <div className="counter-space counter-button" onClick={onClickMinusCounter}>-</div> 
              <div className="counter-space">{mintCount}</div>
              <div className="counter-button" onClick={onClickPlusCounter}>+</div> 
          </div>
          )}
          <MintButton 
            disabled={isSoldOut || isMinting || !isActive}
            onClick={onMint}
            variant="contained"
            className="action-button"
          >
            {isSoldOut ? (
                "SOLD OUT"
              ) : isActive ? (
                isMinting ? (
                  <CircularProgress />
                ) : (
                  t('pages.home.mint')
                )
              ) : (
                <Countdown
                  date={startDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
              )}
          </MintButton>
        </>
        )}
      {/* <p className="para-small-margin">{t('pages.home.line-1')}</p> */}
      <div className="content-loop ">
        <div className="nft-video mx-auto">
          <video loop muted autoPlay className="video-section">
            <source src="https://elasticbeanstalk-us-east-2-916888492548.s3.us-east-2.amazonaws.com/Solajump+Presale-L.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {/* <Quote /> */}
      </div>
    </div>
  </div>
}

export default Home2;