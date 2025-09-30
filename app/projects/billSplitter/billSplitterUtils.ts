import type { LineItem, Person } from "./BillSplitterContext";

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

const STORAGE_KEY = "billSplitterData";

// Smart rounding utility to handle cent distribution
export const calculatePersonShares = (
  item: LineItem
): { [personId: string]: number } => {
  const totalAmount = item.amount;
  const shareCount = item.assignedTo.length;

  if (shareCount === 0) return {};
  if (shareCount === 1) return { [item.assignedTo[0]]: totalAmount };

  const baseShare = totalAmount / shareCount;

  // Calculate base shares (rounded down to 2 decimal places)
  const shares: { [personId: string]: number } = {};
  let totalRounded = 0;

  item.assignedTo.forEach((personId, index) => {
    if (index === 0) {
      // First person gets the base share
      shares[personId] = Math.floor(baseShare * 100) / 100;
    } else {
      // Other people get the base share
      shares[personId] = Math.floor(baseShare * 100) / 100;
    }
    totalRounded += shares[personId];
  });

  // Calculate the difference (rounding error)
  const difference = Math.round((totalAmount - totalRounded) * 100) / 100;

  // Add the difference to the first person
  if (difference !== 0 && item.assignedTo.length > 0) {
    shares[item.assignedTo[0]] =
      Math.round((shares[item.assignedTo[0]] + difference) * 100) / 100;
  }

  return shares;
};

// Calculation functions
export const calculatePersonTotal = (
  lineItems: LineItem[],
  personId: string
): number => {
  return lineItems
    .filter(item => item.assignedTo.includes(personId))
    .reduce((total, item) => {
      const shares = calculatePersonShares(item);
      return total + (shares[personId] || 0);
    }, 0);
};

export const calculateTotal = (lineItems: LineItem[]): number => {
  return lineItems.reduce((total, item) => total + item.amount, 0);
};

export const calculateTotalTip = (
  lineItems: LineItem[],
  tipPercentage: number,
  tipAmount?: number,
  isTipAmountMode?: boolean
): number => {
  if (isTipAmountMode && tipAmount !== undefined) {
    return tipAmount;
  }
  return (calculateTotal(lineItems) * tipPercentage) / 100;
};

export const calculatePersonTip = (
  lineItems: LineItem[],
  tipPercentage: number,
  personId: string,
  tipAmount?: number,
  isTipAmountMode?: boolean
): number => {
  const personTotal = calculatePersonTotal(lineItems, personId);
  const totalBill = calculateTotal(lineItems);
  if (totalBill === 0) return 0;

  // Calculate tip proportionally based on person's share of the bill
  const personShare = personTotal / totalBill;
  const totalTip = calculateTotalTip(
    lineItems,
    tipPercentage,
    tipAmount,
    isTipAmountMode
  );
  return personShare * totalTip;
};

export const calculatePersonTotalWithTip = (
  lineItems: LineItem[],
  tipPercentage: number,
  personId: string,
  tipAmount?: number,
  isTipAmountMode?: boolean
): number => {
  return (
    calculatePersonTotal(lineItems, personId) +
    calculatePersonTip(
      lineItems,
      tipPercentage,
      personId,
      tipAmount,
      isTipAmountMode
    )
  );
};

export const calculateTotalTax = (
  lineItems: LineItem[],
  taxPercentage: number,
  taxAmount?: number,
  isTaxAmountMode?: boolean
): number => {
  if (isTaxAmountMode && taxAmount !== undefined) {
    return taxAmount;
  }
  return (calculateTotal(lineItems) * taxPercentage) / 100;
};

export const calculatePersonTax = (
  lineItems: LineItem[],
  taxPercentage: number,
  personId: string,
  taxAmount?: number,
  isTaxAmountMode?: boolean
): number => {
  const personTotal = calculatePersonTotal(lineItems, personId);
  const totalBill = calculateTotal(lineItems);
  if (totalBill === 0) return 0;

  // Calculate tax proportionally based on person's share of the bill
  const personShare = personTotal / totalBill;
  const totalTax = calculateTotalTax(
    lineItems,
    taxPercentage,
    taxAmount,
    isTaxAmountMode
  );
  return personShare * totalTax;
};

export const calculatePersonTotalWithTax = (
  lineItems: LineItem[],
  taxPercentage: number,
  personId: string,
  taxAmount?: number,
  isTaxAmountMode?: boolean
): number => {
  return (
    calculatePersonTotal(lineItems, personId) +
    calculatePersonTax(
      lineItems,
      taxPercentage,
      personId,
      taxAmount,
      isTaxAmountMode
    )
  );
};

export const calculateGrandTotal = (
  lineItems: LineItem[],
  tipPercentage: number,
  tipAmount?: number,
  isTipAmountMode?: boolean,
  taxPercentage?: number,
  taxAmount?: number,
  isTaxAmountMode?: boolean
): number => {
  return (
    calculateTotal(lineItems) +
    calculateTotalTip(lineItems, tipPercentage, tipAmount, isTipAmountMode) +
    calculateTotalTax(lineItems, taxPercentage || 0, taxAmount, isTaxAmountMode)
  );
};

// Count items assigned to a person
export const countItemsAssignedToPerson = (
  lineItems: LineItem[],
  personId: string
): number => {
  return lineItems.filter(item => item.assignedTo.includes(personId)).length;
};

// Utility functions
export const getPersonById = (
  people: Person[],
  id: string
): Person | undefined => {
  return people.find(p => p.id === id);
};

export const getNextColor = (peopleCount: number): string => {
  return COLORS[peopleCount % COLORS.length];
};

// LocalStorage functions
export const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        people: data.people || [],
        lineItems: data.lineItems || [],
        tipPercentage: data.tipPercentage || 15,
      };
    }
  } catch (error) {
    console.warn("Failed to load data from localStorage:", error);
  }
  return {
    people: [],
    lineItems: [],
    tipPercentage: 15,
  };
};

export const saveToStorage = (
  people: Person[],
  lineItems: LineItem[],
  tipPercentage: number
): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ people, lineItems, tipPercentage })
    );
  } catch (error) {
    console.warn("Failed to save data to localStorage:", error);
  }
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
