// Simple test for receipt parsing logic
// This can be run manually to test the parsing function

const testReceiptText = `
STORE NAME
123 MAIN ST
PHONE: 555-1234

BURGER $12.99
FRIES $4.99
SODA $2.99
TOTAL $20.97
TAX $1.68
GRAND TOTAL $22.65

THANK YOU!
`;

function parseReceiptText(text: string) {
  const lines = text.split("\n").filter((line) => line.trim());
  const items: Array<{ description: string; amount: number }> = [];

  const patterns = [
    /^(.+?)\s+\$?(\d+\.\d{2})$/,
    /^(.+?)\s+\$(\d+\.\d{2})$/,
    /^(.+?)\s+(\d+\.\d{2})$/,
    /^(.+?)\s+(\d+\.\d{2})\s*\$$/,
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      trimmedLine.toLowerCase().includes("total") ||
      trimmedLine.toLowerCase().includes("subtotal") ||
      trimmedLine.toLowerCase().includes("tax") ||
      trimmedLine.toLowerCase().includes("tip") ||
      trimmedLine.toLowerCase().includes("change") ||
      trimmedLine.toLowerCase().includes("cash") ||
      trimmedLine.toLowerCase().includes("card") ||
      trimmedLine.toLowerCase().includes("receipt") ||
      trimmedLine.toLowerCase().includes("thank") ||
      trimmedLine.toLowerCase().includes("date") ||
      trimmedLine.toLowerCase().includes("time") ||
      trimmedLine.toLowerCase().includes("store") ||
      trimmedLine.toLowerCase().includes("address") ||
      trimmedLine.toLowerCase().includes("phone") ||
      trimmedLine.toLowerCase().includes("www") ||
      trimmedLine.toLowerCase().includes("http") ||
      trimmedLine.length < 3
    ) {
      continue;
    }

    for (const pattern of patterns) {
      const match = trimmedLine.match(pattern);
      if (match) {
        const description = match[1].trim();
        const amount = parseFloat(match[2]);

        if (amount > 0 && amount < 10000) {
          items.push({
            description,
            amount,
          });
          break;
        }
      }
    }
  }

  return items;
}

// Test the parsing
const result = parseReceiptText(testReceiptText);
console.log("Parsed items:", result);

export { parseReceiptText };
