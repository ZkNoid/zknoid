import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function walletInstalled() {
  // window.mina?.isConnected();
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

export const formatAddress = (address: string | undefined) =>
  address ? address.slice(0, 5) + '...' + address.slice(-5) : 'None';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
