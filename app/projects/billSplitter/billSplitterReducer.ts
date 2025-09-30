import type {
  Person,
  LineItem,
  BillSplitterState,
} from "./BillSplitterContext";
import {
  BILL_SPLITTER_ACTIONS,
  type BillSplitterAction,
} from "./billSplitterActions";

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

export const defaultState: BillSplitterState = {
  people: [],
  lineItems: [],
  tipPercentage: 15,
  tipAmount: 0,
  isTipAmountMode: false,
  taxPercentage: 0,
  taxAmount: 0,
  isTaxAmountMode: false,
  isDataLoaded: false,
};

export function billSplitterReducer(
  state: BillSplitterState,
  action: BillSplitterAction
): BillSplitterState {
  switch (action.type) {
    case BILL_SPLITTER_ACTIONS.LOAD_DATA:
      return {
        ...state,
        people: action.payload.people,
        lineItems: action.payload.lineItems,
        tipPercentage: action.payload.tipPercentage,
      };

    case BILL_SPLITTER_ACTIONS.ADD_PERSON:
      return {
        ...state,
        people: [...state.people, action.payload],
      };

    case BILL_SPLITTER_ACTIONS.REMOVE_PERSON:
      return {
        ...state,
        people: state.people.filter(p => p.id !== action.payload),
        lineItems: state.lineItems.map(item => ({
          ...item,
          assignedTo: item.assignedTo.filter(id => id !== action.payload),
        })),
      };

    case BILL_SPLITTER_ACTIONS.ADD_LINE_ITEM:
      return {
        ...state,
        lineItems: [...state.lineItems, action.payload],
      };

    case BILL_SPLITTER_ACTIONS.REMOVE_LINE_ITEM:
      return {
        ...state,
        lineItems: state.lineItems.filter(item => item.id !== action.payload),
      };

    case BILL_SPLITTER_ACTIONS.CLEAR_LINE_ITEMS:
      return {
        ...state,
        lineItems: [],
      };

    case BILL_SPLITTER_ACTIONS.CLEAR_PEOPLE:
      return {
        ...state,
        people: [],
        lineItems: state.lineItems.map(item => ({
          ...item,
          assignedTo: [],
        })),
      };

    case BILL_SPLITTER_ACTIONS.TOGGLE_ASSIGNMENT:
      return {
        ...state,
        lineItems: state.lineItems.map(item => {
          if (item.id === action.payload.itemId) {
            const isAssigned = item.assignedTo.includes(
              action.payload.personId
            );
            return {
              ...item,
              assignedTo: isAssigned
                ? item.assignedTo.filter(id => id !== action.payload.personId)
                : [...item.assignedTo, action.payload.personId],
            };
          }
          return item;
        }),
      };

    case BILL_SPLITTER_ACTIONS.SET_TIP_PERCENTAGE:
      return {
        ...state,
        tipPercentage: action.payload,
        isTipAmountMode: false,
      };

    case BILL_SPLITTER_ACTIONS.SET_TIP_AMOUNT:
      return {
        ...state,
        tipAmount: action.payload,
        isTipAmountMode: true,
      };

    case BILL_SPLITTER_ACTIONS.SET_TIP_MODE:
      return {
        ...state,
        isTipAmountMode: action.payload,
      };

    case BILL_SPLITTER_ACTIONS.SET_TAX_PERCENTAGE:
      return {
        ...state,
        taxPercentage: action.payload,
        isTaxAmountMode: false,
      };

    case BILL_SPLITTER_ACTIONS.SET_TAX_AMOUNT:
      return {
        ...state,
        taxAmount: action.payload,
        isTaxAmountMode: true,
      };

    case BILL_SPLITTER_ACTIONS.SET_TAX_MODE:
      return {
        ...state,
        isTaxAmountMode: action.payload,
      };

    case BILL_SPLITTER_ACTIONS.CLEAR_ALL_DATA:
      return {
        ...defaultState,
        isDataLoaded: true,
      };

    case BILL_SPLITTER_ACTIONS.SET_DATA_LOADED:
      return {
        ...state,
        isDataLoaded: action.payload,
      };

    default:
      return state;
  }
}
