import * as Anchor from '@project-serum/anchor';
import { Connection, PublicKey, AccountInfo } from '@solana/web3.js';
import { AccountLayout, MintLayout, MintInfo, AccountInfo as TokenAccountInfo, u64 } from "@solana/spl-token";
import React from 'react';

import {TOKEN_PROGRAM_ID} from './ids';

export interface TokenAccount {
	pubkey: PublicKey;
	account: AccountInfo<Buffer>;
	info: TokenAccountInfo;
}

const PRECACHED_OWNERS = new Set<string>();
const accountsCache = new Map<string, TokenAccount>();

export const getAllTokenAccounts = async (
  connection: Connection,
  owner?: PublicKey
) => {
	// console.log("get All Token started");
  let mintAddrList:string[] = [];
  if (!owner) {
    return [];
  }
  // console.log(owner.toBase58())
  // used for filtering account updates over websocket
  PRECACHED_OWNERS.add(owner.toBase58());

  // user accounts are update via ws subscription
  const accounts = await connection.getTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  accounts.value
    .map((info) => {
      const data = deserializeAccount(info.account.data);
      // need to query for mint to get decimals
      // console.log(info);
      // TODO: move to web3.js for decoding on the client side... maybe with callback
      // console.log(info.pubkey.toBase58());
      const details = {
        pubkey: info.pubkey,
        account: {
          ...info.account,
        },
        info: data,
      } as TokenAccount;

      return details;
    })
    .forEach((acc) => {
      accountsCache.set(acc.pubkey.toBase58(), acc);
      if(acc.info.amount.toNumber() !== 0)
      {
        // console.log(acc.info.amount.toNumber(), acc.info.mint.toBase58());
        mintAddrList.push(acc.info.mint.toBase58());
      }
    });
  return mintAddrList;
};

const deserializeAccount = (data: Buffer) => {
	const accountInfo = AccountLayout.decode(data);
	accountInfo.mint = new PublicKey(accountInfo.mint);
	accountInfo.owner = new PublicKey(accountInfo.owner);
	accountInfo.amount = u64.fromBuffer(accountInfo.amount);
  
	if (accountInfo.delegateOption === 0) {
	  accountInfo.delegate = null;
	  accountInfo.delegatedAmount = new u64(0);
	} else {
	  accountInfo.delegate = new PublicKey(accountInfo.delegate);
	  accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
	}
  
	accountInfo.isInitialized = accountInfo.state !== 0;
	accountInfo.isFrozen = accountInfo.state === 2;
  
	if (accountInfo.isNativeOption === 1) {
	  accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
	  accountInfo.isNative = true;
	} else {
	  accountInfo.rentExemptReserve = null;
	  accountInfo.isNative = false;
	}
  
	if (accountInfo.closeAuthorityOption === 0) {
	  accountInfo.closeAuthority = null;
	} else {
	  accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
	}
  
	return accountInfo;
};