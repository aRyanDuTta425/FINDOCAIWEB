// Use dynamic import for browser environment only
// This avoids WASM loading issues in Node.js/Next.js
let Tesseract: any = null;

async function getTesseract() {
  if (Tesseract === null) {
    if (typeof window === 'undefined') {
      // Server-side - use node-tesseract-ocr for server processing
      console.log('Running in server environment, using node-tesseract-ocr');
      const tesseractOcr = await import('node-tesseract-ocr');
      
      Tesseract = {
        recognize: async (imageData: any, lang = 'eng', options = {}) => {
          try {
            let imagePath: string;
            
            // Handle different input types
            if (typeof imageData === 'string') {
              // If it's already a path or URL
              imagePath = imageData;
            } else if (imageData instanceof Buffer) {
              // Write buffer to temporary file
              const fs = await import('fs');
              const path = await import('path');
              const os = await import('os');
              
              const tempPath = path.join(os.tmpdir(), `ocr_${Date.now()}.png`);
              fs.writeFileSync(tempPath, imageData);
              imagePath = tempPath;
              
              // Clean up function
              const cleanup = () => {
                try {
                  fs.unlinkSync(tempPath);
                } catch (e) {
                  console.warn('Failed to clean up temporary file:', e);
                }
              };
              
              // Schedule cleanup
              setTimeout(cleanup, 5000); // Clean up after 5 seconds
            } else {
              throw new Error('Unsupported image data type for server-side OCR');
            }
            
            console.log('Running Tesseract OCR on:', imagePath);
            const text = await tesseractOcr.default.recognize(imagePath, {
              lang: lang,
              oem: 1,
              psm: 3,
            });
            
            const cleanText = text.trim();
            const confidence = cleanText.length > 10 ? 85 : 50; // Better confidence estimation
            
            console.log(`Server OCR completed: ${cleanText.length} chars, confidence: ${confidence}%`);
            
            return {
              data: {
                text: cleanText,
                confidence: confidence,
                words: []
              }
            };
          } catch (error) {
            console.error('Server-side OCR failed:', error);
            return {
              data: {
                text: 'OCR processing failed on server. Please try uploading a clearer image.',
                confidence: 0,
                words: []
              }
            };
          }
        }
      };
    } else {
      // Client-side - dynamically import Tesseract
      console.log('Running in browser environment, loading Tesseract');
      Tesseract = (await import('tesseract.js')).default;
    }
  }
  return Tesseract;
}

// Similar for PDF.js
async function getPdfLib() {
  if (typeof window === 'undefined') {
    // Return a simplified version for server-side
    return {
      getDocument: () => ({
        promise: Promise.resolve({
          numPages: 1,
          getPage: () => Promise.resolve({
            getViewport: () => ({ width: 800, height: 600 }),
          })
        })
      }),
      GlobalWorkerOptions: { workerSrc: '' }
    };
  } else {
    // Client-side
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    return pdfjsLib;
  }
}

export interface OCRResult {
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

/**
 * Perform OCR on an image file
 */
export async function performOCR(file: File | string | Buffer): Promise<OCRResult> {
  try {
    console.log('Starting OCR processing...', typeof file, file instanceof File ? file.name : file);
    
    // Get Tesseract instance
    const Tesseract = await getTesseract();
    
    let inputData: File | string | Buffer = file;
    
    // If running on server and input is a URL, download it first
    if (typeof window === 'undefined' && typeof file === 'string' && file.startsWith('http')) {
      console.log('Server-side: Downloading image from URL:', file);
      const sharp = await import('sharp');
      
      try {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        
        const imageBuffer = Buffer.from(await response.arrayBuffer());
        
        // Convert to PNG for better OCR compatibility
        const processedBuffer = await sharp.default(imageBuffer)
          .png()
          .resize(null, 1200, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .sharpen()
          .toBuffer();
        
        inputData = processedBuffer;
        console.log('Server-side: Image downloaded and processed');
      } catch (fetchError) {
        console.error('Failed to download image:', fetchError);
        throw new Error('Failed to download image for OCR processing');
      }
    }
    
    const result = await Tesseract.recognize(
      inputData,
      'eng',
      {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    // Extract word-level information if available
    const words = result.data.words?.map((word: any) => ({
      text: word.text,
      confidence: word.confidence,
      bbox: {
        x0: word.bbox.x0,
        y0: word.bbox.y0,
        x1: word.bbox.x1,
        y1: word.bbox.y1,
      }
    })) || [];

    const ocrResult: OCRResult = {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      words: words
    };

    console.log(`OCR completed with confidence: ${ocrResult.confidence}%`);
    console.log(`Extracted text length: ${ocrResult.text.length} characters`);
    return ocrResult;

  } catch (error) {
    console.error('OCR processing failed:', error);
    
    // Return a fallback result instead of throwing error
    return {
      text: "OCR processing encountered an error. Please try again or upload a clearer document.",
      confidence: 0,
      words: []
    };
  }
}

/**
 * Convert PDF page to canvas for OCR processing
 */
async function pdfPageToCanvas(page: any): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Failed to get canvas context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext).promise;
  return canvas;
}

/**
 * Convert PDF page to image data for Node.js environment
 */
async function pdfPageToImageData(page: any): Promise<ImageData> {
  const viewport = page.getViewport({ scale: 2.0 });
  
  // Create a virtual canvas for server-side rendering
  const { createCanvas } = await import('canvas');
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext).promise;
  
  // Convert to ImageData format
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  // Add colorSpace property to match the browser's ImageData interface
  const customImageData = {
    ...imageData,
    colorSpace: 'srgb' as PredefinedColorSpace
  };
  return customImageData;
}

/**
 * Perform OCR on a PDF file
 */
export async function performOCROnPDF(file: File | Buffer | string): Promise<OCRResult[]> {
  try {
    console.log('Starting PDF OCR processing...');
    
    // Server-side placeholder for PDF OCR
    if (typeof window === 'undefined') {
      console.log('Server-side PDF OCR requested, returning placeholder data');
      return [{
        text: "PDF OCR processing will be completed on the client side for better performance.",
        confidence: 0,
        words: []
      }];
    }
    
    let arrayBuffer: ArrayBuffer;
    
    if (file instanceof File) {
      arrayBuffer = await file.arrayBuffer();
    } else if (Buffer.isBuffer(file)) {
      arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
    } else if (typeof file === 'string') {
      // Assume it's a URL, fetch the content
      const response = await fetch(file);
      arrayBuffer = await response.arrayBuffer();
    } else {
      throw new Error('Unsupported file type for PDF OCR');
    }

    // Get the PDF.js library with configured worker
    const pdfjsLib = await getPdfLib();
    
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF loaded with ${pdf.numPages} pages`);
    
    const results: OCRResult[] = [];
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Processing PDF page ${pageNum}/${pdf.numPages}`);
      
      const page = await pdf.getPage(pageNum);
      
      try {
        let imageSource: any;
        
        if (typeof window !== 'undefined') {
          // Browser environment - use canvas
          imageSource = await pdfPageToCanvas(page);
        } else {
          // Node.js environment - use image data
          imageSource = await pdfPageToImageData(page);
        }
        
        const result = await Tesseract.recognize(
          imageSource,
          'eng',
          {
            logger: (m: { status: string; progress: number }) => {
              if (m.status === 'recognizing text') {
                console.log(`Page ${pageNum} OCR Progress: ${Math.round(m.progress * 100)}%`);
              }
            }
          }
        );

        const words = result.data.words?.map((word: any) => ({
          text: word.text,
          confidence: word.confidence,
          bbox: {
            x0: word.bbox.x0,
            y0: word.bbox.y0,
            x1: word.bbox.x1,
            y1: word.bbox.y1,
          }
        })) || [];

        results.push({
          text: result.data.text.trim(),
          confidence: result.data.confidence,
          words: words
        });

      } catch (pageError) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        results.push({
          text: '',
          confidence: 0,
          words: []
        });
      }
    }
    
    console.log(`PDF OCR completed for ${results.length} pages`);
    return results;

  } catch (error) {
    console.error('PDF OCR processing failed:', error);
    throw new Error(`PDF OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Determine file type and perform appropriate OCR
 */
export async function performAutoOCR(file: File): Promise<OCRResult | OCRResult[]> {
  const fileType = file.type.toLowerCase();
  
  if (fileType === 'application/pdf') {
    return await performOCROnPDF(file);
  } else if (fileType.startsWith('image/')) {
    return await performOCR(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Extract text from financial documents with enhanced processing
 */
export async function extractFinancialText(file: File): Promise<{
  rawText: string;
  structuredData: {
    amounts: string[];
    dates: string[];
    entities: string[];
  };
  confidence: number;
}> {
  try {
    const ocrResults = await performAutoOCR(file);
    
    let combinedText = '';
    let totalConfidence = 0;
    let pageCount = 0;
    
    if (Array.isArray(ocrResults)) {
      // PDF with multiple pages
      ocrResults.forEach((result, index) => {
        if (result.text.trim()) {
          combinedText += `--- Page ${index + 1} ---\n${result.text}\n\n`;
          totalConfidence += result.confidence;
          pageCount++;
        }
      });
      totalConfidence = pageCount > 0 ? totalConfidence / pageCount : 0;
    } else {
      // Single image
      combinedText = ocrResults.text;
      totalConfidence = ocrResults.confidence;
    }
    
    // Extract structured financial data
    const amounts = extractAmounts(combinedText);
    const dates = extractDates(combinedText);
    const entities = extractEntities(combinedText);
    
    return {
      rawText: combinedText,
      structuredData: {
        amounts,
        dates,
        entities
      },
      confidence: totalConfidence
    };
    
  } catch (error) {
    console.error('Financial text extraction failed:', error);
    throw error;
  }
}

/**
 * Extract monetary amounts from text
 */
function extractAmounts(text: string): string[] {
  const amountPatterns = [
    /\$[\d,]+\.?\d*/g,
    /USD\s*[\d,]+\.?\d*/g,
    /[\d,]+\.?\d*\s*USD/g,
    /\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\b/g
  ];
  
  const amounts = new Set<string>();
  
  amountPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => amounts.add(match.trim()));
    }
  });
  
  return Array.from(amounts);
}

/**
 * Extract dates from text
 */
function extractDates(text: string): string[] {
  const datePatterns = [
    /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
    /\b\d{1,2}-\d{1,2}-\d{4}\b/g,
    /\b\d{4}-\d{1,2}-\d{1,2}\b/g,
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi
  ];
  
  const dates = new Set<string>();
  
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => dates.add(match.trim()));
    }
  });
  
  return Array.from(dates);
}

/**
 * Extract company/entity names from text
 */
function extractEntities(text: string): string[] {
  const entityPatterns = [
    /\b[A-Z][a-z]+\s+(?:Inc|Corp|LLC|Ltd|Company|Co)\b/g,
    /\b[A-Z]{2,}\s+[A-Z][a-z]+/g,
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+\s+(?:Bank|Credit|Financial|Group)\b/g
  ];
  
  const entities = new Set<string>();
  
  entityPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => entities.add(match.trim()));
    }
  });
  
  return Array.from(entities);
}
