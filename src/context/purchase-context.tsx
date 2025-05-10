"use client";
import { PurchaseData } from "@/interfaces/purchase";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface PurchaseContextType {
  purchaseData: PurchaseData[];
  setPurchaseData: React.Dispatch<React.SetStateAction<PurchaseData[]>>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined
);

export const PurchaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([]);

  return (
    <PurchaseContext.Provider value={{ purchaseData, setPurchaseData }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error(
      "usePurchaseContext must be used within an PurchaseProvider"
    );
  }
  return context;
};
