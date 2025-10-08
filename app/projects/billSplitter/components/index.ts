export { PeopleSection } from "./PeopleSection";
export { LineItemsSection } from "./LineItemsSection";
export { TipSection } from "./TipSection";
export { TaxSection } from "./TaxSection";
export { TotalsSection } from "./TotalsSection";
export { ReceiptScanner } from "./ReceiptScanner";
export { SimpleImageTest } from "./SimpleImageTest";

// Receipt Scanner sub-components
export { InputModeToggle } from "./InputModeToggle";
export { ImageUploadSection } from "./ImageUploadSection";
export { TextInputSection } from "./TextInputSection";
export { ExtractedItemsList } from "./ExtractedItemsList";
export { JsonResponseDisplay } from "./JsonResponseDisplay";

// Types and utilities
export type { ExtractedItem, InputMode, ReceiptProcessingState, ReceiptProcessingActions } from "./types/receiptScanner";
export { fileToBase64, extractItemsFromText, generateItemId } from "./utils/receiptUtils";
