import type { Person, LineItem } from "./BillSplitterContext";

// Action types
export const BILL_SPLITTER_ACTIONS = {
  LOAD_DATA: "LOAD_DATA",
  ADD_PERSON: "ADD_PERSON",
  REMOVE_PERSON: "REMOVE_PERSON",
  ADD_LINE_ITEM: "ADD_LINE_ITEM",
  REMOVE_LINE_ITEM: "REMOVE_LINE_ITEM",
  TOGGLE_ASSIGNMENT: "TOGGLE_ASSIGNMENT",
  SET_TIP_PERCENTAGE: "SET_TIP_PERCENTAGE",
  CLEAR_ALL_DATA: "CLEAR_ALL_DATA",
  SET_DATA_LOADED: "SET_DATA_LOADED",
} as const;

// Action type definitions
export type BillSplitterAction =
  | {
      type: typeof BILL_SPLITTER_ACTIONS.LOAD_DATA;
      payload: {
        people: Person[];
        lineItems: LineItem[];
        tipPercentage: number;
      };
    }
  | { type: typeof BILL_SPLITTER_ACTIONS.ADD_PERSON; payload: Person }
  | { type: typeof BILL_SPLITTER_ACTIONS.REMOVE_PERSON; payload: string }
  | { type: typeof BILL_SPLITTER_ACTIONS.ADD_LINE_ITEM; payload: LineItem }
  | { type: typeof BILL_SPLITTER_ACTIONS.REMOVE_LINE_ITEM; payload: string }
  | {
      type: typeof BILL_SPLITTER_ACTIONS.TOGGLE_ASSIGNMENT;
      payload: { itemId: string; personId: string };
    }
  | { type: typeof BILL_SPLITTER_ACTIONS.SET_TIP_PERCENTAGE; payload: number }
  | { type: typeof BILL_SPLITTER_ACTIONS.CLEAR_ALL_DATA }
  | { type: typeof BILL_SPLITTER_ACTIONS.SET_DATA_LOADED; payload: boolean };

// Action creators
export const loadData = (
  people: Person[],
  lineItems: LineItem[],
  tipPercentage: number,
): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.LOAD_DATA,
  payload: { people, lineItems, tipPercentage },
});

export const addPerson = (person: Person): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.ADD_PERSON,
  payload: person,
});

export const removePerson = (personId: string): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.REMOVE_PERSON,
  payload: personId,
});

export const addLineItem = (lineItem: LineItem): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.ADD_LINE_ITEM,
  payload: lineItem,
});

export const removeLineItem = (itemId: string): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.REMOVE_LINE_ITEM,
  payload: itemId,
});

export const toggleAssignment = (
  itemId: string,
  personId: string,
): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.TOGGLE_ASSIGNMENT,
  payload: { itemId, personId },
});

export const setTipPercentage = (percentage: number): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.SET_TIP_PERCENTAGE,
  payload: percentage,
});

export const clearAllData = (): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.CLEAR_ALL_DATA,
});

export const setDataLoaded = (isLoaded: boolean): BillSplitterAction => ({
  type: BILL_SPLITTER_ACTIONS.SET_DATA_LOADED,
  payload: isLoaded,
});
