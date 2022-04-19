import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  mintMultipleToken,
  shortenAddress,
} from "./candy-machine";

import { Switch, Route, useLocation } from 'react-router-dom';

// Components
import Header from './components/Header'
import Nav from './components/Nav'
import SocialNav from './components/SocialNav'

//Constants
import { MAIN_MENU } from './constants/header-constants';

// Pages
import Home2 from './components/Home2'
import Content3 from './components/Content3'
import Content4 from './components/Content4'
import Team from './components/Team'
import Layout from "./components/Layout"

import PageNotFound from './components/PageNotFound'

// Style
import './styles.scss';
import { isWhiteSpaceLike } from "typescript";

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

const SnackbarStyle = {
  // height:"120px",
  width:"800px",
  fontSize:"25px",
  // background:"green"
  border: "solid 2px #85b9eb"
}

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const Home = (props: HomeProps) => {
  //assigning location variable
  const location = useLocation();
  //destructuring pathname from location
  const { pathname } = location;
  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/");

  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));
  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const setAlertSetting = (setting) => {
    setAlertState({open:setting.open, message:setting.message, severity:setting.severity});
  }

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

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (  
    <main>

                  <Switch>
                    <Route exact path={`${MAIN_MENU['menu-1'].slug}`}>
                      <Home2 
                        candyMachineId={props.candyMachineId}
                        config={props.config}
                        connection={props.connection}
                        startDate={props.startDate}
                        treasury={props.treasury}
                        txTimeout={props.txTimeout}
                        setAlertSetting={setAlertSetting}
                      />
                    </Route>
                    {/* <Route path={`/${MAIN_MENU['menu-2'].slug}`}>
                      <Team />
                    </Route>
                    <Route path={`/${MAIN_MENU['menu-3'].slug}`}>
                      <Content3 />
                    </Route>
                    <Route path={`/${MAIN_MENU['menu-4'].slug}`}>
                      <Content4 />
                    </Route> */}
                    <Route component={PageNotFound} />
                  </Switch>


      {/* /* { {wallet && ( //POSSIBLE PROBLEM?
        <p>Wallet {shortenAddress(wallet?.publicKey.toBase58() || "")}</p>
      )}
      {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>}
      {wallet && <p>Total Available: {itemsAvailable}</p>}
      {wallet && <p>Redeemed: {itemsRedeemed}</p>}
      {wallet && <p>Remaining: {itemsRemaining}</p>}  */}
      

      {/* <MintContainer>
        {!wallet ? (
          <ConnectButton>Connect Wallet</ConnectButton>
        ) : (
          <MintButton
            disabled={isSoldOut || isMinting || !isActive}
            onClick={onMint}
            variant="contained"
          >
            {isSoldOut ? (
              "SOLD OUT"
            ) : isActive ? (
              isMinting ? (
                <CircularProgress />
              ) : (
                "MINT"
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
        )}
            </MintContainer> */}
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
          style={SnackbarStyle}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;