import { UserInfo } from "../model/index";
import { encryption } from "./encryption";

	let dataCrypt = ""
export const saveToLocalStorage = (info : any) => {
	let data = info;
	let dataCrypt = encryption(data);
	window.sessionStorage.setItem("userInfo", dataCrypt);
}

export const getUserInfo = () => {
	let data = window.sessionStorage.getItem("userInfo");
	if(data === null) return null;
	return (data);
}


// fnl4z7x51h 2kf1yh7e6xk 2 a pntxb3309x 1 fv3v8q61pe 7

