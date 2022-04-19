import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router";
import { getUserInfo } from "../../utils/storage";
import { useDocument } from "../DocumentProvider";
import { ExternalLink } from "react-external-link";
import { ReadContest, getTop10RankDataElie, getDocDataSendUserData  } from "../Firebase/firebase";
import { encryption } from "../../utils/encryption";
import {Context} from "../../hooks/ContextProvider"

import Unity from "react-unity-webgl";
import { unityContext } from "../../constants/game-unity-context";
import "./styles.scss";



export function Game() {

  const context = useContext(Context)

  useEffect(() => {
    // NE SERT QUA TESTTER LE contextUser dont on va avoir besoin
    console.log("ContextUser:",  context.contextUser);
  }, [])

  

  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saidMessage, setSaidMessage] = useState("Nothing");
  //const [lives, setLives] = React.useState();
  const [sendReactToUnity, setSendReactToUnity] = useState(0);
  // const [ouvertureContest, setOuvertureContest] = useState<string>("0");
  const [absorbeReponseContest, setAbsorbeReponseContest] = useState("");
  const [stockDataUser, setStockDataUser] = useState();
  const [flagOne, setFlagOne] = useState(false);
  // const [absorbeTopTen, setAbsorbeTopTen] = useState([]);

    // fonction qui appel Firebase pour lui demander si mon contest est ouvert


  // USE EFFECT QUI INITIALISE L'APPLI
  useEffect(function callback() {
    unityContext.on("progress", setProgress);
    unityContext.on("loaded", () => setIsLoaded(true));
    unityContext.on("CheckDB", handleFunctionUnityCheckDB);

    return function cleanup() {
      // LORSQUE MON COMPONENT SE DEMONTE, J'ACTIVE LA FONCTION EN DESSOUS
      unityContext.removeAllEventListeners();
    };
  }, []);

  useEffect(async() => {
 
    const setResult = await ReadContest();
    console.log("le résultat du contest via firebase en direct est :", setResult);
    await setAbsorbeReponseContest(setResult)
    console.log(absorbeReponseContest);
    console.log("est-til bien lu en dernier",absorbeReponseContest);
    unityContext.send("GameManager", "CheckContestIsOpen", absorbeReponseContest);
  }, [flagOne])

  
  function handleFunctionUnityCheckDB(message) {
    console.log("handleFunctionUnityCheckDB Open");
    setSaidMessage(message)
    if (message === "Contest" ) {
        console.log("le message Contest à été appelé");
        setFlagOne(true)
        
        

    }else if (message === "DocData") {
   //   console.log("le message DocData à été envoyé");
    }else{
      console.log("je n'ai recu aucun message");
    }
  
}



//   const GetTop10 = async () =>{
//     const ResultTop10 = await getTop10RankDataElie();
//     console.log("le top 10 est le suivant :", ResultTop10);
 
//   }

//   const GetDataUser = async () =>{
//     const ResultUserData = await getDocDataSendUserData(context.contextUser);
//     setStockDataUser(ResultUserData)
//     console.log("ici on ressort le useState",  stockDataUser);


//   }

//   useEffect(() => {
//     //J'appel mon contest depuis firbase
//     GetContest()
//     // GetTop10()
//      GetDataUser()
//     // TODO -- POUR QUE REACT ECOUTE CE QUE UNITY LUI ENVOI C'EST EN DESSOUS
//      unityContext.on("CheckDB", handleFunctionUnityCheckDB);

//   }, [absorbeReponseContest])

//   useEffect(() => {

//     // POUR ENVOYER UN MSG A UNITY, JE LUI ENVOI UNE VARIABLE APRES AVOIR DESIGNER : DANS QUEL GAME OBJECT ET... LE NOM DE CETTE FONCTION
//     unityContext.send("TestData", "setSendReactToUnity", sendReactToUnity);

//     //  console.log(sendReactToUnity);
    
//   }, [sendReactToUnity]);








   

//     // en dessous c'est juste pour lire le message
//     setSaidMessage(message);
//   }


  function EnvoiDataReactToUnity() {
    setSendReactToUnity(sendReactToUnity+471);
   // console.log(sendReactToUnity);
  }




  return (
    <section className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-auto border">
          <h1 className="text-light text-center mx-auto"></h1>
          <div className="game-container">
            {isLoaded === false && (
              <div className="game-loading-container">
                <div className="loading-bar">
                  <div
                    className="loading-bar-fill"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            )}
              <p>de unity to react</p>
            <Unity className="game-unity" unityContext={unityContext}  />
            <button onClick={EnvoiDataReactToUnity}>Envoi Data</button>
            The Unity app said <b>"{saidMessage}"</b>!
             
          </div>
        </div>
      </div>
    </section>
  );
}

