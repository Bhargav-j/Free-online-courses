import { createContext, useState } from "react";

export const GlobalStateContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");

  const [selectedcategories, setselectedcategories] = useState([]);

  return (
    <GlobalStateContext.Provider
      value={{
        searchInput,
        setSearchInput,
        selectedcategories,
        setselectedcategories,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
