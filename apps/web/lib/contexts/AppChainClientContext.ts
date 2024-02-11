import { ClientAppChain } from "@proto-kit/sdk";
import { createContext } from "react";

export const AppChainClientContext = createContext<ClientAppChain<any> | undefined>(
    undefined
  );
  