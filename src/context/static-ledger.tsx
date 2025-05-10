"use client";
import { Item, SuperParent } from "@/interfaces/static-ledger";
import React, { createContext, ReactNode, useContext, useReducer } from "react";

interface AddItemAction {
  type: "ADD_ITEM";
  payload: {
    superParentId: string;
    name: string;
    parentId?: string;
  };
}

interface EditItemAction {
  type: "EDIT_ITEM";
  payload: {
    superParentId: string;
    id: string;
    name: string;
  };
}

interface DeleteItemAction {
  type: "DELETE_ITEM";
  payload: {
    superParentId: string;
    id: string;
  };
}

type TableAction = AddItemAction | EditItemAction | DeleteItemAction;

interface StaticLedgerContextType {
  superParents: SuperParent[];
  dispatchAction: (action: TableAction) => void;
}

const initialSuperParents: SuperParent[] = [
  {
    id: "1",
    name: "Assets",
    items: [
      {
        id: "1.1",
        name: "Non-Current Assets",
        parentId: null,
        superParentId: "1",
        children: [
          {
            id: "1.1.1",
            name: "Fixed Assets",
            parentId: "1.1",
            superParentId: "1",
            children: [
              {
                id: "1.1.1.1",
                name: "Land and Buildings",
                parentId: "1.1.1",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.1.2",
                name: "Plant and Machinery",
                parentId: "1.1.1",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.1.3",
                name: "Furniture and Fixtures",
                parentId: "1.1.1",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.1.4",
                name: "Vehicles",
                parentId: "1.1.1",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.1.5",
                name: "Computers and Equipment",
                parentId: "1.1.1",
                superParentId: "1",
                children: [],
              },
            ],
          },
          {
            id: "1.1.2",
            name: "Intangible Assets",
            parentId: "1.1",
            superParentId: "1",
            children: [
              {
                id: "1.1.2.1",
                name: "Goodwill",
                parentId: "1.1.2",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.2.2",
                name: "Patents and Trademarks",
                parentId: "1.1.2",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.2.3",
                name: "Software Licenses",
                parentId: "1.1.2",
                superParentId: "1",
                children: [],
              },
            ],
          },
          {
            id: "1.1.3",
            name: "Capital Work in Progress (CWIP)",
            parentId: "1.1",
            superParentId: "1",
            children: [],
          },
          {
            id: "1.1.4",
            name: "Investments",
            parentId: "1.1",
            superParentId: "1",
            children: [
              {
                id: "1.1.4.1",
                name: "Investment in Subsidiaries",
                parentId: "1.1.4",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.4.2",
                name: "Investment in Associates",
                parentId: "1.1.4",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.4.3",
                name: "Equity Shares",
                parentId: "1.1.4",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.1.4.4",
                name: "Bonds and Debentures",
                parentId: "1.1.4",
                superParentId: "1",
                children: [],
              },
            ],
          },
          {
            id: "1.1.5",
            name: "Deferred Tax Assets",
            parentId: "1.1",
            superParentId: "1",
            children: [],
          },
        ],
      },
      {
        id: "1.2",
        name: "Current Assets",
        parentId: null,
        superParentId: "1",
        children: [
          {
            id: "1.2.1",
            name: "Inventories",
            parentId: "1.2",
            superParentId: "1",
            children: [
              {
                id: "1.2.1.1",
                name: "Raw Materials",
                parentId: "1.2.1",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.2.1.2",
                name: "Work-in-Progress",
                parentId: "1.2.1",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.2.1.3",
                name: "Finished Goods",
                parentId: "1.2.1",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.2.1.4",
                name: "Stores and Spares",
                parentId: "1.2.1",
                superParentId: "1",
                children: [],
              },
            ],
          },
          {
            id: "1.2.2",
            name: "Trade Receivables (Accounts Receivable)",
            parentId: "1.2",
            superParentId: "1",
            children: [],
          },
          {
            id: "1.2.3",
            name: "Cash and Cash Equivalents",
            parentId: "1.2",
            superParentId: "1",
            children: [
              {
                id: "1.2.3.1",
                name: "Cash in Hand",
                parentId: "1.2.3",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.2.3.2",
                name: "Bank Balances",
                parentId: "1.2.3",
                superParentId: "1",
                children: [
                  {
                    id: "1.2.3.2.1",
                    name: "PNB A/c",
                    parentId: "1.2.3.2",
                    superParentId: "1",
                    children: [],
                  },
                  {
                    id: "1.2.3.2.2",
                    name: "HDFC",
                    parentId: "1.2.3.2",
                    superParentId: "1",
                    children: [],
                  },
                ],
              },
              {
                id: "1.2.3.3",
                name: "Short-Term Deposits",
                parentId: "1.2.3",
                superParentId: "1",
                children: [],
              },
            ],
          },
          {
            id: "1.2.4",
            name: "Other Current Assets",
            parentId: "1.2",
            superParentId: "1",
            children: [
              {
                id: "1.2.4.1",
                name: "Advance Tax",
                parentId: "1.2.4",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.2.4.2",
                name: "Prepaid Expenses",
                parentId: "1.2.4",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.2.4.3",
                name: "Accrued Income",
                parentId: "1.2.4",
                superParentId: "1",
                children: [],
              },
              {
                id: "1.2.4.4",
                name: "Loans and Advances",
                parentId: "1.2.4",
                superParentId: "1",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Liabilities",
    items: [
      {
        id: "2.1",
        name: "Non-Current Liabilities",
        parentId: null,
        superParentId: "2",
        children: [
          {
            id: "2.1.1",
            name: "Long-Term Borrowings",
            parentId: "2.1",
            superParentId: "2",
            children: [
              {
                id: "2.1.1.1",
                name: "Term Loans",
                parentId: "2.1.1",
                superParentId: "2",
                children: [],
              },
              {
                id: "2.1.1.2",
                name: "Debentures",
                parentId: "2.1.1",
                superParentId: "2",
                children: [],
              },
              {
                id: "2.1.1.3",
                name: "Bonds",
                parentId: "2.1.1",
                superParentId: "2",
                children: [],
              },
            ],
          },
          {
            id: "2.1.2",
            name: "Deferred Tax Liabilities",
            parentId: "2.1",
            superParentId: "2",
            children: [],
          },
          {
            id: "2.1.3",
            name: "Long-Term Provisions",
            parentId: "2.1",
            superParentId: "2",
            children: [
              {
                id: "2.1.3.1",
                name: "Gratuity Provisions",
                parentId: "2.1.3",
                superParentId: "2",
                children: [],
              },
              {
                id: "2.1.3.2",
                name: "Leave Encashment Provisions",
                parentId: "2.1.3",
                superParentId: "2",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "2.2",
        name: "Current Liabilities",
        parentId: null,
        superParentId: "2",
        children: [
          {
            id: "2.2.1",
            name: "Trade Payables (Accounts Payable)",
            parentId: "2.2",
            superParentId: "2",
            children: [],
          },
          {
            id: "2.2.2",
            name: "Short-Term Borrowings",
            parentId: "2.2",
            superParentId: "2",
            children: [
              {
                id: "2.2.2.1",
                name: "Bank Overdraft",
                parentId: "2.2.2",
                superParentId: "2",
                children: [],
              },
              {
                id: "2.2.2.2",
                name: "Short-Term Loans",
                parentId: "2.2.2",
                superParentId: "2",
                children: [],
              },
            ],
          },
          {
            id: "2.2.3",
            name: "Other Current Liabilities",
            parentId: "2.2",
            superParentId: "2",
            children: [
              {
                id: "2.2.3.1",
                name: "Statutory Liabilities (GST, TDS, etc.)",
                parentId: "2.2.3",
                superParentId: "2",
                children: [],
              },
              {
                id: "2.2.3.2",
                name: "Accrued Expenses",
                parentId: "2.2.3",
                superParentId: "2",
                children: [],
              },
              {
                id: "2.2.3.3",
                name: "Advance from Customers",
                parentId: "2.2.3",
                superParentId: "2",
                children: [],
              },
              {
                id: "2.2.3.4",
                name: "Other Payables",
                parentId: "2.2.3",
                superParentId: "2",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Equity",
    items: [
      {
        id: "3.1",
        name: "Share Capital",
        parentId: null,
        superParentId: "3",
        children: [
          {
            id: "3.1.1",
            name: "Equity Share Capital",
            parentId: "3.1",
            superParentId: "3",
            children: [],
          },
          {
            id: "3.1.2",
            name: "Preference Share Capital",
            parentId: "3.1",
            superParentId: "3",
            children: [],
          },
        ],
      },
      {
        id: "3.2",
        name: "Reserves and Surplus",
        parentId: null,
        superParentId: "3",
        children: [
          {
            id: "3.2.1",
            name: "General Reserve",
            parentId: "3.2",
            superParentId: "3",
            children: [],
          },
          {
            id: "3.2.2",
            name: "Retained Earnings",
            parentId: "3.2",
            superParentId: "3",
            children: [],
          },
          {
            id: "3.2.3",
            name: "Revaluation Reserve",
            parentId: "3.2",
            superParentId: "3",
            children: [],
          },
          {
            id: "3.2.4",
            name: "Capital Redemption Reserve",
            parentId: "3.2",
            superParentId: "3",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Revenue",
    items: [
      {
        id: "4.1",
        name: "Operating Revenue",
        parentId: null,
        superParentId: "4",
        children: [
          {
            id: "4.1.1",
            name: "Sales",
            parentId: "4.1",
            superParentId: "4",
            children: [
              {
                id: "4.1.1.1",
                name: "Domestic Sales",
                parentId: "4.1.1",
                superParentId: "4",
                children: [],
              },
              {
                id: "4.1.1.2",
                name: "Export Sales",
                parentId: "4.1.1",
                superParentId: "4",
                children: [],
              },
              {
                id: "4.1.1.3",
                name: "Sales Returns",
                parentId: "4.1.1",
                superParentId: "4",
                children: [],
              },
            ],
          },
          {
            id: "4.1.2",
            name: "Service Revenue",
            parentId: "4.1",
            superParentId: "4",
            children: [
              {
                id: "4.1.2.1",
                name: "Consulting Fees",
                parentId: "4.1.2",
                superParentId: "4",
                children: [],
              },
              {
                id: "4.1.2.2",
                name: "Service Charges",
                parentId: "4.1.2",
                superParentId: "4",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "4.2",
        name: "Other Income",
        parentId: null,
        superParentId: "4",
        children: [
          {
            id: "4.2.1",
            name: "Interest Income",
            parentId: "4.2",
            superParentId: "4",
            children: [],
          },
          {
            id: "4.2.2",
            name: "Dividend Income",
            parentId: "4.2",
            superParentId: "4",
            children: [],
          },
          {
            id: "4.2.3",
            name: "Gain on Sale of Assets",
            parentId: "4.2",
            superParentId: "4",
            children: [],
          },
          {
            id: "4.2.4",
            name: "Other Miscellaneous Income",
            parentId: "4.2",
            superParentId: "4",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "5",
    name: "Expenses",
    items: [
      {
        id: "5.1",
        name: "Cost of Goods Sold (COGS)",
        parentId: null,
        superParentId: "5",
        children: [
          {
            id: "5.1.1",
            name: "Raw Material Consumed",
            parentId: "5.1",
            superParentId: "5",
            children: [],
          },
          {
            id: "5.1.2",
            name: "Direct Labor",
            parentId: "5.1",
            superParentId: "5",
            children: [],
          },
          {
            id: "5.1.3",
            name: "Manufacturing Overheads",
            parentId: "5.1",
            superParentId: "5",
            children: [],
          },
        ],
      },
      {
        id: "5.2",
        name: "Operating Expenses",
        parentId: null,
        superParentId: "5",
        children: [
          {
            id: "5.2.1",
            name: "Administrative Expenses",
            parentId: "5.2",
            superParentId: "5",
            children: [
              {
                id: "5.2.1.1",
                name: "Rent",
                parentId: "5.2.1",
                superParentId: "5",
                children: [],
              },
              {
                id: "5.2.1.2",
                name: "Office Supplies",
                parentId: "5.2.1",
                superParentId: "5",
                children: [],
              },
              {
                id: "5.2.1.3",
                name: "Utilities",
                parentId: "5.2.1",
                superParentId: "5",
                children: [],
              },
              {
                id: "5.2.1.4",
                name: "Depreciation and Amortization",
                parentId: "5.2.1",
                superParentId: "5",
                children: [],
              },
            ],
          },
          {
            id: "5.2.2",
            name: "Selling and Distribution Expenses",
            parentId: "5.2",
            superParentId: "5",
            children: [
              {
                id: "5.2.2.1",
                name: "Advertising and Marketing",
                parentId: "5.2.2",
                superParentId: "5",
                children: [],
              },
              {
                id: "5.2.2.2",
                name: "Sales Commission",
                parentId: "5.2.2",
                superParentId: "5",
                children: [],
              },
              {
                id: "5.2.2.3",
                name: "Distribution Expenses",
                parentId: "5.2.2",
                superParentId: "5",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "5.3",
        name: "Financial Expenses",
        parentId: null,
        superParentId: "5",
        children: [
          {
            id: "5.3.1",
            name: "Interest on Loans",
            parentId: "5.3",
            superParentId: "5",
            children: [],
          },
          {
            id: "5.3.2",
            name: "Bank Charges",
            parentId: "5.3",
            superParentId: "5",
            children: [],
          },
          {
            id: "5.3.3",
            name: "Other Financial Costs",
            parentId: "5.3",
            superParentId: "5",
            children: [],
          },
        ],
      },
      {
        id: "5.4",
        name: "Other Expenses",
        parentId: null,
        superParentId: "5",
        children: [
          {
            id: "5.4.1",
            name: "Loss on Sale of Assets",
            parentId: "5.4",
            superParentId: "5",
            children: [],
          },
          {
            id: "5.4.2",
            name: "Provision for Bad Debts",
            parentId: "5.4",
            superParentId: "5",
            children: [],
          },
          {
            id: "5.4.3",
            name: "Miscellaneous Expenses",
            parentId: "5.4",
            superParentId: "5",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "6",
    name: "Provisions and Other Adjustments",
    items: [
      {
        id: "6.1",
        name: "Provisions",
        parentId: null,
        superParentId: "6",
        children: [
          {
            id: "6.1.1",
            name: "Provision for Bad Debts",
            parentId: "6.1",
            superParentId: "6",
            children: [],
          },
          {
            id: "6.1.2",
            name: "Provision for Warranties",
            parentId: "6.1",
            superParentId: "6",
            children: [],
          },
        ],
      },
      {
        id: "6.2",
        name: "Other Adjustments",
        parentId: null,
        superParentId: "6",
        children: [
          {
            id: "6.2.1",
            name: "Prior Period Adjustments",
            parentId: "6.2",
            superParentId: "6",
            children: [],
          },
          {
            id: "6.2.2",
            name: "Unrealized Foreign Exchange Gain/Loss",
            parentId: "6.2",
            superParentId: "6",
            children: [],
          },
        ],
      },
    ],
  },
];

function staticLedgerReducer(
  state: SuperParent[],
  action: TableAction
): SuperParent[] {
  switch (action.type) {
    case "ADD_ITEM": {
      return state.map((sp) => {
        if (sp.id === action.payload.superParentId) {
          const newItem: Item = {
            id: `${Date.now()}`,
            name: action.payload.name,
            parentId: action.payload.parentId,
            superParentId: sp.id,
            children: [],
          };

          const addItemToChildren = (items: Item[]): Item[] =>
            items.map((item) => {
              if (item.id === action.payload.parentId) {
                return { ...item, children: [...item.children, newItem] };
              }
              if (item.children.length > 0) {
                return { ...item, children: addItemToChildren(item.children) };
              }
              return item;
            });

          if (!action.payload.parentId) {
            return { ...sp, items: [...sp.items, newItem] };
          }

          return { ...sp, items: addItemToChildren(sp.items) };
        }
        return sp;
      });
    }

    case "EDIT_ITEM": {
      return state.map((sp) => {
        if (sp.id === action.payload.superParentId) {
          const editItemInChildren = (items: Item[]): Item[] =>
            items.map((item) => {
              if (item.id === action.payload.id) {
                return { ...item, name: action.payload.name };
              }
              if (item.children.length > 0) {
                return { ...item, children: editItemInChildren(item.children) };
              }
              return item;
            });

          return { ...sp, items: editItemInChildren(sp.items) };
        }
        return sp;
      });
    }

    case "DELETE_ITEM": {
      return state.map((sp) => {
        if (sp.id === action.payload.superParentId) {
          const deleteItemFromChildren = (items: Item[]): Item[] =>
            items.filter((item) => {
              if (item.id === action.payload.id) return false;
              if (item.children.length > 0) {
                item.children = deleteItemFromChildren(item.children);
              }
              return true;
            });

          return { ...sp, items: deleteItemFromChildren(sp.items) };
        }
        return sp;
      });
    }

    default:
      const _exhaustiveCheck: never = action;
      console.error("Unknown action type:", _exhaustiveCheck);
      return state;
  }
}

const StaticLedgerContext = createContext<StaticLedgerContextType | undefined>(
  undefined
);

export const StaticLedgerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [superParents, dispatchAction] = useReducer(
    staticLedgerReducer,
    initialSuperParents
  );

  return (
    <StaticLedgerContext.Provider value={{ superParents, dispatchAction }}>
      {children}
    </StaticLedgerContext.Provider>
  );
};

export const useStaticLedgerContext = () => {
  const context = useContext(StaticLedgerContext);
  if (!context) {
    throw new Error(
      "useStaticLedgerContext must be used within StaticLedgerProvider"
    );
  }
  return context;
};
