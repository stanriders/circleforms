import React, { createContext, useContext,useState } from "react";

const FormContext = createContext<any>(null);

// this is used for creating new form, because we need to persist state between tabs
export const FormDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState({});

  const setValues = (values: any) => {
    setData((prevData) => ({
      ...prevData,
      ...values
    }));
  };

  return <FormContext.Provider value={{ data, setValues }}>{children}</FormContext.Provider>;
};

export const useFormData = () => useContext(FormContext);
