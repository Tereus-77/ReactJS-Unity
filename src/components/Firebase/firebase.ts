import { initializeApp } from "firebase/app"
import config from './config';
import { getFirestore, collection, addDoc, getDocs, doc, query, where, setDoc, updateDoc, getDoc } from 'firebase/firestore/lite';

const Firebase = initializeApp(config.firebase);


export default Firebase;

export const db = getFirestore(Firebase);

function getRandomString(length) {
    var randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

export const ReadContest = async () => {
	let data ;
	const docRef = await query(collection(db, 'admin'));
	const allDocs = await getDocs(docRef);
//	console.log(allDocs);
	
	allDocs.forEach(async (dc) =>{
		data = dc.get("contest")
	})
	if(allDocs.size > 0) return data
	else {console.log("Error, no docs found.")}

}
// export const getDocDataSendUserData = async () => {
// 	let data ;
// 	const docRef = await query(collection(db, 'main', "104"));
// 	const allDocs = await getDocs(docRef);
// 	console.log(allDocs);
	

// 	if(allDocs.size > 0) return data
// 	else {console.log("Error, no docs found.")}

// }

export const getDocDataSendUserData = async (DocData) => {
	const docRef = doc(db, "main", DocData);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
//	console.log("Document data:", docSnap.data());
	return docSnap.data()
	} else {
	// doc.data() will be undefined in this case
	console.log("No such document!");
	}
};

// save walletAddress with mintAddress when user mint in home page.
export const  getMintId = async (mintAddress, walletAddress) => {
	const q = query(collection(db, "main"));
	const querySnapshot = await getDocs(q);

	let nextDocID = querySnapshot.size + 1;
	let docname = nextDocID.toString();
	// if(querySnapshot.size < 9) docname = "0" + docname;
	if(querySnapshot.size < 9) docname = "0" + docname;

	// let docname = getRandomString(12);

	if(walletAddress !== undefined){
		await setDoc(doc(db, "main", docname), {
			walletAddress: walletAddress,
			mintAddress: mintAddress,
		});
		return true;
	}else{
		return console.log('wallet is undefined, please connect wallet..')
	}
}

export const getWalletExists = async (walletAddress) => {
	const q = query(collection(db, "main"), where("walletAddress", "==", walletAddress));
	const querySnapshot = await getDocs(q);
	if(querySnapshot.size > 0)	return true;
	else return false;
};

// compare wallet token mint address with firebase stored DB.
export const isMintAddressExists = async (mintAddress) => {
	let docID, walletAddr, username, email, lives, score, date;
	const q = query(collection(db, "main"), where("mintAddress", "==", mintAddress));
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach(async (dc) => {
		docID = dc.id;
		walletAddr = dc.get("walletAddress");
		username = dc.get("username");
		email = dc.get("email");
		lives = dc.get("lives");
		score = dc.get("highscore");
	});

	if(querySnapshot.size == 0) return undefined;
	return {
		docID:docID, 
		walletAddress:walletAddr,
		mintAddress:mintAddress,
		username:username,
		email:email,
		lives:lives,
		highscore:score,
	};
};




// update current document for wallet Address with new.
export const updateWalletAddressForDifferent = async (docID, walletAddress) => {
	const currDoc = doc(db, "main", docID);
	await updateDoc(currDoc, {
		walletAddress:walletAddress,
	});
};





// update current document with new username, user email.
export const updateDocuments = async (docID, username, email) => {
	const currDoc = doc(db, "main", docID);
	await updateDoc(currDoc, {
		username:username,
		email:email,
	});
};

// update current document with new username, user email and add highscore(0), lives(10)
export const updateUnnamedDocuments = async (docID, username, email) => {
	const currDoc = doc(db, "main", docID);
	await updateDoc(currDoc, {
		username:username,
		email:email,
		lives:10,
		highscore:0,
	});
};


export const getTop10RankData = async () => {
	const q = query(collection(db, "main"));
	const querySnapshot = await getDocs(q);

	let data_array:any[] = [];
	querySnapshot.forEach(async (dc) => {
		let tmp:any = {};
		tmp.docID = dc.id;
		tmp.walletAddr = dc.get("walletAddress");
		tmp.username = dc.get("username");
		// tmp.email = dc.get("email");
		// tmp.lives = dc.get("lives");
		tmp.walletAddress = dc.get("walletAddress");
		tmp.highscore = dc.get("highscore");
		data_array.push(tmp as any);
	});
	data_array.sort(compare);
	let score_array:any[] = [];
	for(var i=0; i<Math.min(5, data_array.length); i++){
		score_array.push({rank:i+1,username:data_array[i].username, highscore:data_array[i].highscore,wallet:data_array[i].walletAddress});
	}
	return score_array;
	//return data_array;
}
export const getTop10RankDataElie = async () => {
	const q = query(collection(db, "main"));
	const querySnapshot = await getDocs(q);

	let data_array:any[] = [];
	querySnapshot.forEach(async (dc) => {
		let tmp:any = {};
		tmp.docID = dc.id;
		tmp.walletAddr = dc.get("walletAddress");
		tmp.username = dc.get("username");
		// tmp.email = dc.get("email");
		// tmp.lives = dc.get("lives");
		tmp.walletAddress = dc.get("walletAddress");
		tmp.highscore = dc.get("highscore");
		data_array.push(tmp as any);
	});
	data_array.sort(compare);
	let score_array:any[] = [];
	for(var i=0; i<Math.min(11, data_array.length); i++){
		score_array.push({rank:i+1,username:data_array[i].username, highscore:data_array[i].highscore,wallet:data_array[i].walletAddress});
	}
	return score_array;
	//return data_array;
}

function compare( a, b ) {
	if(a.highscore === undefined) return 1;
	if(b.highscore === undefined) return -1;
	if ( a.highscore > b.highscore ){
	  return -1;
	}
	if ( a.highscore < b.highscore ){
	  return 1;
	}
	return 0;
}
