import { createContext, useContext } from "react";

export const globalContext = createContext({});

export const useGlobalContext = () => useContext(globalContext);

export const GlobalProvider = globalContext.Provider