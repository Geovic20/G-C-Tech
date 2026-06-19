import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'CFA' | 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInCFA: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Approximate conversion rates for demo purposes
const RATES = {
  CFA: 1,
  USD: 1 / 600, // 1 USD = 600 CFA
  EUR: 1 / 650, // 1 EUR = 650 CFA
};

const SYMBOLS = {
  CFA: 'F',
  USD: '$',
  EUR: '€',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('CFA');

  const formatPrice = (priceInCFA: number) => {
    const converted = priceInCFA * RATES[currency];
    const symbol = SYMBOLS[currency];
    
    if (currency === 'CFA') {
      return `${converted.toLocaleString()} ${symbol}`;
    }
    
    // For USD and EUR, show decimal points
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
