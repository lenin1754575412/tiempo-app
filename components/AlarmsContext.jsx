import React, { createContext, useContext, useState } from 'react';

const AlarmsContext = createContext(null);

export function AlarmsProvider({ children }) {
  const [alarms, setAlarms] = useState([]);
  return (
    <AlarmsContext.Provider value={{ alarms, setAlarms }}>
      {children}
    </AlarmsContext.Provider>
  );
}

export function useAlarms() {
  const value = useContext(AlarmsContext);
  if (!value) throw new Error('useAlarms debe estar dentro de AlarmsProvider');
  return value;
}
