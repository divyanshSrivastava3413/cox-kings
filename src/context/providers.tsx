"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  OnboardingCustomerProvider,
  OnboardingVendorProvider,
} from "./onboarding-context";
import { PurchaseProvider } from "./purchase-context";
import { StaticLedgerProvider } from "./static-ledger";

const queryClient = new QueryClient();

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PurchaseProvider>
        <OnboardingCustomerProvider>
          <OnboardingVendorProvider>
            <StaticLedgerProvider>{children}</StaticLedgerProvider>
          </OnboardingVendorProvider>
        </OnboardingCustomerProvider>
      </PurchaseProvider>
    </QueryClientProvider>
  );
};
