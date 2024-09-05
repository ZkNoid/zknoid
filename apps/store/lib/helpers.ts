import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function walletInstalled() {
  return typeof mina !== 'undefined';
}

export async function requestAccounts() {
  if (window.mina?.isPallad) {
    return await window.mina
      ?.request({ method: 'mina_accounts' })
      .then((resp) => resp.result);
  } else {
    return await window.mina?.requestAccounts();
  }
}

export async function sendTransaction(txJson: any) {
  if (window.mina?.isPallad) {
    const signResp = await window.mina.request({
      method: 'mina_signTransaction',
      params: {
        transaction: txJson,
      },
    });

    console.log('Sign resp', signResp);

    const sendResp = await window.mina.request({
      method: 'mina_sendTransaction',
      params: {
        signedTransaction: signResp.result,
        transactionBody: txJson,
        transactionType: 'zkapp',
      },
    });

    console.log('Send resp', sendResp);

    return sendResp.result.hash;
  } else {
    try {
      const { hash } = await (window as any).mina.sendTransaction({
        transaction: txJson,
        feePayer: {
          fee: '0.1',
          memo: '',
        },
      });
      return hash;
    } catch (e: any) {
      if (e?.code == 1001) {
        await requestAccounts();
        return await sendTransaction(txJson);
      }
    }
  }
}

export const formatAddress = (address: string | undefined) =>
  address ? address.slice(0, 5) + '...' + address.slice(-5) : 'None';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
