import { Dialog, DialogTitle, DialogContent, DialogActions,
	Button, Box, IconButton, Typography, CircularProgress, TextField} from '@material-ui/core';
import { Link } from "react-router-dom";
import { Close } from '@material-ui/icons';
import React, { Component, useEffect, useState } from 'react';

// Images
import Logo from '../../assets/images/Logo_solajump1.png'
// Utils
import { useTranslation } from 'react-i18next';

// Style
import './styles.scss';
import { shortenAddress, } from "../../candy-machine";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import styled from "styled-components";
import { Redirect } from 'react-router';
import {getAllTokenAccounts} from './../../utils/accounts';
import * as anchor from "@project-serum/anchor";
import { isMintAddressExists, updateDocuments, updateUnnamedDocuments, updateWalletAddressForDifferent, getTop10RankData } from '../Firebase/firebase';
import {timeout} from '../../utils/delay';
import { useDocument } from '../DocumentProvider';
import { saveToLocalStorage } from '../../utils/storage';


import { withStyles } from "@material-ui/core/styles";

export interface LoginProps{
  connection: anchor.web3.Connection;
}

export default function Login(props: LoginProps){
  const { t } = useTranslation();
  const ConnectButton = styled(WalletDialogButton)``;
  const wallet = useAnchorWallet();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletMintAddressList, setWalletMintAddressList] = useState<string[]>([]);
  const [tokenExistence, setTokenExistence] = useState(-1);
  const [username, setUsername] = useState("");
  const [defaultUsername, setDefaultUsername] = useState("");
	const [email, setEmail] = useState("");
  
  const [unnamedDocList, setUnnamedDocList] = useState<string[]>([]);
  const [totalDocIdList, setTotalDocIdList] = useState<string[]>([]);
  const [walletConnected, setwalletConnected] = useState(false)
  const [walletCheckingFlag, setWalletCheckingFlag] = useState(false);
  const [userConfirmPassedFlag, setUserConfirmPassedFlag] = useState(-1);
  const [updateNameConfirmFlag, setUpdateNameConfirmFlag] = useState(-1);
  const [IsNoClicked, setIsNoClicked] = useState(false);
  const [IsCancelClicked, setIsCancelClicked] = useState(false);
  const [IsUpdateClicked, setIsUpdateClicked] = useState(false);
  const [ReadyMintFlag, setReadyMintFlag] = useState(false);
  const [RedirectMintMessageShowFlag, setRedirectMintMessageShowFlag] = useState(false);
  const [ReadyGameFlag, setReadyGameFlag] = useState(false);
  const [RedirectGameMessageShowFlag, setRedirectGameMessageShowFlag] = useState(false);

  const [selectedTokenMintAddress, setSelectedTokenMintAddress] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const {currentDoc, setDoc} = useDocument();
  
  const AlertTypography = withStyles({
    root: {
      color: "#fb3131"
    }
  })(Typography);
  
  useEffect(() => {
    const showRequiredMintMessage = async () => {
      setRedirectMintMessageShowFlag(true);
      await timeout(3000);
      setReadyMintFlag(true);
    }
    if(tokenExistence === 0 && walletCheckingFlag == true) showRequiredMintMessage();
  }, [tokenExistence, walletCheckingFlag])

  useEffect(() => {
    const showRequiredGameMessage = async () => {
      setRedirectGameMessageShowFlag(true);
      setDoc(await isMintAddressExists(selectedTokenMintAddress));
      await timeout(3000);
      setReadyGameFlag(true);
    }
    if(tokenExistence > 0 && walletCheckingFlag === true && userConfirmPassedFlag === 1 && updateNameConfirmFlag === 1) showRequiredGameMessage();
  }, [tokenExistence,walletCheckingFlag,userConfirmPassedFlag,updateNameConfirmFlag ]);

  // function for unnamed documents.
  const updateUnnamedDocs = async () => {
    setIsUpdateClicked(true);
    for await (const tmpDocID of unnamedDocList){
      await updateUnnamedDocuments(tmpDocID, username, email);
    }
    for await (const tmpDocID of totalDocIdList){
      await updateDocuments(tmpDocID, username, email);
    }
    saveToLocalStorage(totalDocIdList);
    setUserConfirmPassedFlag(1);
    setUpdateNameConfirmFlag(1);
  }

  const returnToGame = async () => {
    setIsNoClicked(true);
    for await (const tmpDocID of unnamedDocList){
      await updateUnnamedDocuments(tmpDocID, defaultUsername, email);
    }
    saveToLocalStorage(totalDocIdList);
    setIsCancelClicked(true);
    setUpdateNameConfirmFlag(1);
    setUserConfirmPassedFlag(1);
  }

  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


  useEffect(() =>  {
    const getWalletMintAddresses = async () => {
      if(wallet && wallet.publicKey){
        setWalletAddress(wallet.publicKey.toBase58());
        const result = await getAllTokenAccounts( props.connection, wallet.publicKey);
        setWalletMintAddressList(result);
        setwalletConnected(true)
      //  let data = getTop10RankData();
      // download(JSON.stringify(await data,null,2),'top10-test.txt','json');
      }
      else
      {
        setWalletAddress("Please connect to the wallet!");
      }
    };
    getWalletMintAddresses();
  }, [wallet])

  useEffect(() => {
    const getDocumentID = async () => {
      let exists_flag = false;
      let unnamedList : string[] = [];
      let totalDocList: string[] = [];
      // if token mint address list is not empty
      if(walletMintAddressList.length > 0){
        // loop for every mint address
        for await (const mintAddr of walletMintAddressList) {
          // check current mint address exists in firebase database.
          const retResult = await isMintAddressExists(mintAddr);
          // if current mint address is existed in the database,
          // console.log(retResult);
          if(retResult !== undefined){
            if(selectedTokenMintAddress ==="" && retResult.lives !== undefined && retResult.lives > 0)
              setSelectedTokenMintAddress(mintAddr);
            // save docID to list
            totalDocList.push(retResult.docID);
            // if returned wallet address is not same as current wallet address
            if(retResult.walletAddress !== walletAddress){
              // update walletAddress for current docID.
              await updateWalletAddressForDifferent(retResult.docID, walletAddress);
            }
            // NFT token mint address exists.
            exists_flag = true;
            // if current doc's username does not exists
            if(retResult.username === undefined) {
              // set Name update flag
              // setNameUpdateFlag(true);
              // add unnamed docID to list
              unnamedList.push(retResult.docID);
            } else {
              // set username
              setUsername(retResult.username);
              setDefaultUsername(retResult.username);
            }
            if(retResult.email === undefined) {
              // setEmail(retResult.email);
            } else { // if current doc email is valid
              // set email
              setEmail(retResult.email);
            }
          }
        }
        // set unnamed docID list
        setUnnamedDocList(unnamedList);
        // set total docId list
        setTotalDocIdList(totalDocList);

        // if in wallet the token is not existed, cannot go to the game main page.
        if(exists_flag == false) {
          // console.log("setTokenExistence(0);")
          setTokenExistence(0);
        } else {
          // can go to the game main page.
          setTokenExistence(1);
          // console.log("setTokenExistence(1);")
        }
        // set wallet with db checking flag.
        setWalletCheckingFlag(true);
      }
      else
      {
        // if freshwallet,
        if(walletConnected === true)
        { 
          // can't go to the main page.(redirect to mint page)
          setTokenExistence(0);
          // set wallet checking flag.
          setWalletCheckingFlag(true);
        }
      }
    }
    getDocumentID();
  }, [walletMintAddressList]);
  
  useEffect(() => {
    const pattern = /^[a-zA-Z0-9]+$/g;
    const result = pattern.test(username);
    console.log(result);
    if(result === true){
      setNameError("");
    } else {
      setNameError("Username can't contain any special character or symbol.");
    }
    if(username === "" || username === undefined) setNameError("Username cannot be empty.");
    if(username.length > 12) setNameError("Username length is not more than 12.");
  }, [username]);

  useEffect(() => {
    const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    const result = pattern.test(email);
    if(result===true){
      setEmailError("");
    } else{
      setEmailError("Email is not valid. Try again.");
    }
  }, [email])

  // if NFT game token existed in wallet, db, and don't need to update name, go to game page.
  if(ReadyGameFlag === true) {
    return (<Redirect to="/game" />);
  }

  // if NFT game token is not existed, wallet is connected, go to mint page.
  if(ReadyMintFlag === true) {
    return (<Redirect to="/"/>);
  }

  return <div> 
      <div className="header d-flex justify-content-between header-div">
        <div className="logo">
          <div className="logo-section">
            <a href="/">
              <img src={Logo} alt="" />
            </a>
          </div>
        </div>
      </div>
      {/* if walletChecking is finished, Confirm button clicked for user(want to update username, email)?,  */}
      {(walletCheckingFlag === true && (userConfirmPassedFlag === 0 || userConfirmPassedFlag === -1 && defaultUsername === "" && tokenExistence === 1)
      )?(<Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Would you like to change user name?</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton>
        <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>UserName : </Typography>
        <TextField value={username} inputProps={{min: 0, maxLength:12, style: { textAlign: 'center' }}} onChange={(e)=>{setUsername(e.target.value);}}></TextField>
        <AlertTypography>{nameError}</AlertTypography>
      </DialogContent>
      <DialogContent>
        <Typography>Email : </Typography>
        <TextField value={email} inputProps={{min: 0, style: { textAlign: 'center' }}} onChange={(e)=>{setEmail(e.target.value);}}></TextField>
        <AlertTypography>{emailError}</AlertTypography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" disabled={nameError!=="" || emailError!==""} onClick={returnToGame} variant="contained"> 
          {!IsCancelClicked?("Cancel"):(<CircularProgress />)}
        </Button>
        <Button color="secondary" disabled={nameError!=="" || emailError!==""} onClick={updateUnnamedDocs} variant="contained"> 
          {!IsUpdateClicked?("Update"):(<CircularProgress />)}
        </Button>
      </DialogActions>
      </Dialog>)
      :(<> </>)
      }

      {/* if current username exists and wallet checking finished,  */}
      {RedirectMintMessageShowFlag?(<Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Redirecting to mint page. Please wait ... <CircularProgress /></DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton>
        <Close />
        </IconButton>
      </Box>
      </Dialog>)
      :(<> </>)
      }

      {RedirectGameMessageShowFlag?(<Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Redirecting to Game. Please wait ... <CircularProgress /></DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton>
        <Close />
        </IconButton>
      </Box>
      </Dialog>)
      :(<> </>)
      }
      
      {/* if current username exists and wallet checking finished,  */}
      {(walletCheckingFlag === true && walletConnected === true && defaultUsername !== "" && tokenExistence === 1 && userConfirmPassedFlag === -1)?(<Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Current username is {defaultUsername}, and email is {email}. <br/>
        Would you like to change username and email?</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton>
        <Close />
        </IconButton>
      </Box>
      <DialogActions>
        <Button color="primary" onClick={ returnToGame } variant="contained">
          {!IsNoClicked?("No"):(<CircularProgress />)}
        </Button>
        <Button color="secondary" onClick={() => {setUserConfirmPassedFlag(0);}} variant="contained">Yes</Button>
      </DialogActions>
      </Dialog>)
      :(<> </>)
      }

      <div className="header d-flex content-div">
        <div className="subcontent">
          <div className="welcome-title">{t('pages.login.title')}</div><br/><br/>
          <ConnectButton className="action-button mt-2">{wallet?shortenAddress(wallet.publicKey.toBase58()):t('header.button')}</ConnectButton><br/>
          
          <Link to="/">
            <button className="btn-hover-outline">Go to Mint page ...</button>
          </Link>

        </div>
      </div>
    </div>
}
