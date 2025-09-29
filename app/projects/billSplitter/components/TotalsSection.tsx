import { useBillSplitter } from "../BillSplitterContext";
import Accordion from "~/projects/billSplitter/components/Accordian";
import PersonItemsList from "~/projects/billSplitter/components/PersonItemsList";
import ContentCopyIcon from "~/assets/ContentCopyIcon";
import { useState } from "react";

export function TotalsSection() {
  const { state, calculations } = useBillSplitter();
  const [copySuccess, setCopySuccess] = useState(false);

  const generateTotalsText = () => {
    let text = "BILL SPLIT TOTALS\n";
    text += "=".repeat(30) + "\n\n";

    // Individual person totals
    state.people.forEach((person) => {
      const personTotal = calculations.calculatePersonTotal(person.id);
      const personTip = calculations.calculatePersonTip(person.id);
      const personTax = calculations.calculatePersonTax(person.id);
      const personTotalWithTip = calculations.calculatePersonTotalWithTip(person.id);
      const itemCount = calculations.countItemsAssignedToPerson(person.id);

      // Get items assigned to this person
      const personItems = state.lineItems
        .filter(item => item.assignedTo.includes(person.id))
        .map(item => ({
          ...item,
          personShare: item.amount / item.assignedTo.length
        }));

      text += `${person.name}\n`;
      text += `   Subtotal: $${personTotal.toFixed(2)}\n`;
      
      if (calculations.calculateTotalTip() > 0) {
        text += `   Tip: $${personTip.toFixed(2)}\n`;
      }
      
      if (calculations.calculateTotalTax() > 0) {
        text += `   Tax: $${personTax.toFixed(2)}\n`;
      }
      
      text += `   Total: $${personTotalWithTip.toFixed(2)}\n`;
      
      // Add line items breakdown
      if (personItems.length > 0) {
        text += `   \n   Items (${itemCount}):\n`;
        personItems.forEach((item) => {
          const splitInfo = item.assignedTo.length > 1 ? ` (split ${item.assignedTo.length} ways)` : '';
          text += `   • ${item.description}${splitInfo}: $${item.personShare.toFixed(2)}\n`;
        });
      }
      
      text += `\n`;
    });

    // Overall totals
    text += "OVERALL TOTALS\n";
    text += "-".repeat(20) + "\n";
    text += `Subtotal: $${calculations.calculateTotal().toFixed(2)}\n`;
    
    if (calculations.calculateTotalTip() > 0) {
      text += `Tip: $${calculations.calculateTotalTip().toFixed(2)}\n`;
    }
    
    if (calculations.calculateTotalTax() > 0) {
      text += `Tax: $${calculations.calculateTotalTax().toFixed(2)}\n`;
    }
    
    text += `Grand Total: $${calculations.calculateGrandTotal().toFixed(2)}\n`;

    return text;
  };

  const handleCopyTotals = async () => {
    try {
      const text = generateTotalsText();
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="rounded-lg bg-zinc-800 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-volt-400 text-xl font-semibold">Totals</h2>
        <button
          onClick={handleCopyTotals}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            copySuccess
              ? 'bg-green-600 text-white'
              : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'
          }`}
        >
          <ContentCopyIcon size={16} color="currentColor" />
          {copySuccess ? 'Copied!' : 'Copy Totals'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.people.map((person) => (
          <Accordion
            key={person.id}
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full ${person.color}`}></div>
                  <span className="font-medium">{person.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-volt-400 text-xl font-bold">
                    ${calculations.calculatePersonTotalWithTip(person.id).toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {calculations.countItemsAssignedToPerson(person.id)} items
                  </div>
                </div>
              </div>
            }
            className="bg-zinc-700"
          >
            <div className="space-y-3">
              {/* Summary */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    ${calculations.calculatePersonTotal(person.id).toFixed(2)}
                  </span>
                </div>
                {calculations.calculateTotalTip() > 0 && (
                  <div className="text-volt-400 flex justify-between">
                    <span>Tip:</span>
                    <span>
                      ${calculations.calculatePersonTip(person.id).toFixed(2)}
                    </span>
                  </div>
                )}
                {calculations.calculateTotalTax() > 0 && (
                  <div className="text-volt-400 flex justify-between">
                    <span>Tax:</span>
                    <span>
                      ${calculations.calculatePersonTax(person.id).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <PersonItemsList
                personId={person.id}
                personName={person.name}
                lineItems={state.lineItems}
              />
            </div>
          </Accordion>
        ))}
      </div>

      <div className="mt-6 border-t border-zinc-600 pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Subtotal:</span>
            <span className="text-xl font-semibold">
              ${calculations.calculateTotal().toFixed(2)}
            </span>
          </div>
          {calculations.calculateTotalTip() > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Tip:</span>
              <span className="text-xl font-semibold">
                ${calculations.calculateTotalTip().toFixed(2)}
              </span>
            </div>
          )}
          {calculations.calculateTotalTax() > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Tax:</span>
              <span className="text-xl font-semibold">
                ${calculations.calculateTotalTax().toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-zinc-600 pt-2">
            <span className="text-lg font-semibold">Grand Total:</span>
            <span className="text-volt-400 text-2xl font-bold">
              ${calculations.calculateGrandTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
