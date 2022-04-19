import React from 'react';

export interface documentInfo {
	mintAddress:string,
	walletAddress:string,
	username:string,
	email:string,
	lives:number,
	highscore:number,
}

export interface UserInfo {
	username:string,
	highscore:number,
	lives:number,
}