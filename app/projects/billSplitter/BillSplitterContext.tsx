import React, { createContext, useContext, useReducer, useEffect } from "react";
import { billSplitterReducer, defaultState } from "./billSplitterReducer";
import { loadFromStorage, saveToStorage } from "./billSplitterUtils";
import {
  calculatePersonTotal,
  calculatePersonTip,
  calculatePersonTotalWithTip,
  calculatePersonTax,
  calculatePersonTotalWithTax,
  calculateTotal,
  calculateTotalTip,
  calculateTotalTax,
  calculateGrandTotal,
  countItemsAssignedToPerson,
  getPersonById,
  getNextColor,
} from "./billSplitterUtils";

interface Person {
  id: string;
  name: string;
  color: string;
}

interface LineItem {
  id: string;
  description: string;
  amount: number;
  assignedTo: string[];
}

interface BillSplitterState {
  people: Person[];
  lineItems: LineItem[];
  tipPercentage: number;
  tipAmount: number;
  isTipAmountMode: boolean;
  taxPercentage: number;
  taxAmount: number;
  isTaxAmountMode: boolean;
  isDataLoaded: boolean;
}

// Context creation
const BillSplitterContext = createContext<{
  state: BillSplitterState;
  dispatch: React.Dispatch<any>;
  calculations: {
    calculatePersonTotal: (personId: string) => number;
    calculatePersonTip: (personId: string) => number;
    calculatePersonTotalWithTip: (personId: string) => number;
    calculatePersonTax: (personId: string) => number;
    calculatePersonTotalWithTax: (personId: string) => number;
    calculateTotal: () => number;
    calculateTotalTip: () => number;
    calculateTotalTax: () => number;
    calculateGrandTotal: () => number;
    countItemsAssignedToPerson: (personId: string) => number;
    getPersonById: (id: string) => Person | undefined;
    getNextColor: () => string;
  };
} | null>(null);

// Provider component
export function BillSplitterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(billSplitterReducer, defaultState);

  // Load data from localStorage on mount
  useEffect(() => {
    const { people, lineItems, tipPercentage } = loadFromStorage();
    if (people.length > 0 || lineItems.length > 0) {
      dispatch({
        type: "LOAD_DATA",
        payload: { people, lineItems, tipPercentage },
      });
    }
    dispatch({ type: "SET_DATA_LOADED", payload: true });
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (
      state.isDataLoaded &&
      (state.people.length > 0 || state.lineItems.length > 0)
    ) {
      saveToStorage(state.people, state.lineItems, state.tipPercentage);
    }
  }, [state.people, state.lineItems, state.tipPercentage, state.isDataLoaded]);

  const calculations = {
    calculatePersonTotal: (personId: string) =>
      calculatePersonTotal(state.lineItems, personId),
    calculatePersonTip: (personId: string) =>
      calculatePersonTip(state.lineItems, state.tipPercentage, personId, state.tipAmount, state.isTipAmountMode),
    calculatePersonTotalWithTip: (personId: string) =>
      calculatePersonTotalWithTip(
        state.lineItems,
        state.tipPercentage,
        personId,
        state.tipAmount,
        state.isTipAmountMode,
      ),
    calculatePersonTax: (personId: string) =>
      calculatePersonTax(state.lineItems, state.taxPercentage, personId, state.taxAmount, state.isTaxAmountMode),
    calculatePersonTotalWithTax: (personId: string) =>
      calculatePersonTotalWithTax(
        state.lineItems,
        state.taxPercentage,
        personId,
        state.taxAmount,
        state.isTaxAmountMode,
      ),
    calculateTotal: () => calculateTotal(state.lineItems),
    calculateTotalTip: () =>
      calculateTotalTip(state.lineItems, state.tipPercentage, state.tipAmount, state.isTipAmountMode),
    calculateTotalTax: () =>
      calculateTotalTax(state.lineItems, state.taxPercentage, state.taxAmount, state.isTaxAmountMode),
    calculateGrandTotal: () =>
      calculateGrandTotal(
        state.lineItems, 
        state.tipPercentage, 
        state.tipAmount, 
        state.isTipAmountMode,
        state.taxPercentage,
        state.taxAmount,
        state.isTaxAmountMode
      ),
    countItemsAssignedToPerson: (personId: string) =>
      countItemsAssignedToPerson(state.lineItems, personId),
    getPersonById: (id: string) => getPersonById(state.people, id),
    getNextColor: () => getNextColor(state.people.length),
  };

  return (
    <BillSplitterContext.Provider value={{ state, dispatch, calculations }}>
      {children}
    </BillSplitterContext.Provider>
  );
}

// Custom hook to use the context
export function useBillSplitter() {
  const context = useContext(BillSplitterContext);
  if (!context) {
    throw new Error(
      "useBillSplitter must be used within a BillSplitterProvider",
    );
  }
  return context;
}

// Export types for use in other files
export type { Person, LineItem, BillSplitterState };
