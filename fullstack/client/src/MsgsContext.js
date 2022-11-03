import React, { useContext, useState } from "react";

const MsgsContext = React.createContext();
const MsgsUpdateContext = React.createContext();

export function useMsgs() {
  return useContext(MsgsContext);
}

export function useMsgsUpdate() {
  return useContext(MsgsUpdateContext);
}

export function MsgsProvider({ children }) {
  const [ msgs, setMsgs ] = useState([]);

  const updateMsgs = (data) => {
    setMsgs(data);
  }

  return (
    <MsgsContext.Provider value={msgs}>
      <MsgsUpdateContext.Provider value={updateMsgs}>
        {children}
      </MsgsUpdateContext.Provider>
    </MsgsContext.Provider>
  )
}