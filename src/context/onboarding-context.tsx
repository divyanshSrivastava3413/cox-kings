"use client";
import { OnboardingCustomer, OnboardingVendor } from "@/interfaces/onboarding";
import { createContext, useContext, useState } from "react";

const OnboardingCustomerContext = createContext<
  | {
      onboardingCustomer: OnboardingCustomer[];
      setOnboardingCustomer: React.Dispatch<
        React.SetStateAction<OnboardingCustomer[]>
      >;
    }
  | undefined
>(undefined);

const OnboardingVendorContext = createContext<
  | {
      onboardingVendor: OnboardingVendor[];
      setOnboardingVendor: React.Dispatch<
        React.SetStateAction<OnboardingVendor[]>
      >;
    }
  | undefined
>(undefined);

export const OnboardingCustomerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [onboardingCustomer, setOnboardingCustomer] = useState<
    OnboardingCustomer[]
  >([]);

  return (
    <OnboardingCustomerContext.Provider
      value={{ onboardingCustomer, setOnboardingCustomer }}
    >
      {children}
    </OnboardingCustomerContext.Provider>
  );
};

export function useOnboardingCustomer() {
  const context = useContext(OnboardingCustomerContext);
  if (context === undefined) {
    throw new Error(
      "useOnboardingCustomer must be used within an OnboardingCustomerProvider"
    );
  }
  return context;
}

export const OnboardingVendorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [onboardingVendor, setOnboardingVendor] = useState<OnboardingVendor[]>(
    []
  );

  return (
    <OnboardingVendorContext.Provider
      value={{ onboardingVendor, setOnboardingVendor }}
    >
      {children}
    </OnboardingVendorContext.Provider>
  );
};

export function useOnboardingVendor() {
  const context = useContext(OnboardingVendorContext);
  if (context === undefined) {
    throw new Error(
      "useOnboardingVendor must be used within an OnboardingVendorProvider"
    );
  }
  return context;
}
