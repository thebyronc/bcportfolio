# Bill Splitter

A modern web application for splitting bills and expenses among multiple people with automatic receipt scanning capabilities.

## Features

### Core Functionality

- **Add People**: Add participants to split the bill
- **Line Items**: Add individual items with descriptions and amounts
- **Item Assignment**: Assign items to specific people or multiple people
- **Tip Calculator**: Adjustable tip percentage with automatic calculations
- **Automatic Totals**: Real-time calculation of individual and group totals
- **Data Persistence**: Automatically saves data to browser storage

### Receipt Scanner (NEW!)

- **OCR Integration**: Uses Tesseract.js for optical character recognition
- **Image Upload**: Support for JPEG, PNG, GIF, and BMP formats
- **Automatic Parsing**: Intelligently extracts line items from receipt images
- **Smart Filtering**: Filters out totals, taxes, and other non-item text
- **Manual Review**: Review and edit extracted items before adding
- **Raw Text View**: Option to view the raw OCR text for debugging

## How to Use

### Basic Bill Splitting

1. Add people using the "People" section
2. Add line items manually in the "Line Items" section
3. Assign items to people by clicking on their names
4. Adjust tip percentage as needed
5. View individual totals in the "Totals" section

### Receipt Scanning

1. Click "Upload Receipt Image" in the "Receipt Scanner" section
2. Select a clear image of your receipt
3. Wait for OCR processing (usually 5-15 seconds)
4. Review the extracted items
5. Click "Add" for individual items or "Add All" for all items
6. Optionally view raw OCR text for debugging

## Tips for Best Results

### Receipt Scanning

- Ensure good lighting when taking photos
- Keep the receipt flat and clearly visible
- Avoid shadows and glare
- Use high-resolution images when possible
- Make sure text is readable and not blurry

### Manual Entry

- Use descriptive names for items
- Double-check amounts before adding
- Assign items to the correct people
- Review totals before finalizing

## Technical Details

### Dependencies

- **Tesseract.js**: OCR engine for receipt scanning
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

### Browser Support

- Modern browsers with ES6+ support
- Requires camera/file upload permissions for receipt scanning
- Works offline for manual entry features

### Data Storage

- All data is stored locally in browser storage
- No data is sent to external servers
- Data persists between browser sessions

## Troubleshooting

### Receipt Scanner Issues

- **No items found**: Try adjusting the image quality or lighting
- **Incorrect amounts**: Manually edit the extracted items
- **Missing items**: Check the raw OCR text for recognition issues
- **Slow processing**: Large images may take longer to process

### General Issues

- **Data not saving**: Check browser storage permissions
- **Calculations wrong**: Verify item assignments and amounts
- **UI not loading**: Refresh the page and try again

## Future Enhancements

- Support for multiple receipt formats
- Automatic receipt categorization
- Export functionality for expense reports
- Mobile app version
- Cloud storage integration
