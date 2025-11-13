// src/lib/downloadTicketPDF.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

// Check if color string contains unsupported color functions
function hasUnsupportedColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  const lowerColor = color.toLowerCase();
  return lowerColor.includes('lab(') || 
         lowerColor.includes('oklab(') || 
         lowerColor.includes('oklch(') || 
         lowerColor.includes('lch(') ||
         lowerColor.includes('color(');
}

// Function to aggressively fix all CSS colors and preserve all styles
function fixCSSColors(clonedDoc: Document) {
  const ticketElement = document.getElementById("ticket-section");
  if (!ticketElement) return;

  const clonedElement = clonedDoc.getElementById("ticket-section");
  if (!clonedElement) return;

  // Recursively fix colors while preserving layout
  function applyAllStyles(originalEl: Element, clonedEl: Element) {
    try {
      const originalElement = originalEl as HTMLElement;
      const clonedElementEl = clonedEl as HTMLElement;
      
      // Get computed styles from original
      const computed = window.getComputedStyle(originalElement);
      
      // Only fix colors - let CSS handle layout
      const bgColor = computed.backgroundColor;
      if (bgColor) {
        if (!hasUnsupportedColor(bgColor)) {
          clonedElementEl.style.backgroundColor = bgColor;
        } else {
          clonedElementEl.style.backgroundColor = getFallbackColor(clonedElementEl, 'background');
        }
      }
      
      const textColor = computed.color;
      if (textColor) {
        if (!hasUnsupportedColor(textColor)) {
          clonedElementEl.style.color = textColor;
        } else {
          clonedElementEl.style.color = getFallbackColor(clonedElementEl, 'text');
        }
      }
      
      const borderColor = computed.borderColor;
      if (borderColor) {
        if (!hasUnsupportedColor(borderColor)) {
          clonedElementEl.style.borderColor = borderColor;
        } else {
          clonedElementEl.style.borderColor = getFallbackColor(clonedElementEl, 'border');
        }
      }
      
      // Ensure visibility
      clonedElementEl.style.visibility = 'visible';
      clonedElementEl.style.opacity = '1';
      
      // Recursively apply to all children
      const originalChildren = Array.from(originalElement.children);
      const clonedChildren = Array.from(clonedElementEl.children);
      
      for (let i = 0; i < originalChildren.length && i < clonedChildren.length; i++) {
        applyAllStyles(originalChildren[i], clonedChildren[i]);
      }
    } catch {
      // Ignore errors
    }
  }

  applyAllStyles(ticketElement, clonedElement);
}

// Get fallback color based on element context
function getFallbackColor(element: HTMLElement, type: 'background' | 'text' | 'border'): string {
  // Check if element or parent has dark class
  let isDark = false;
  let current: HTMLElement | null = element;
  while (current) {
    if (current.classList.contains('dark')) {
      isDark = true;
      break;
    }
    current = current.parentElement;
  }
  
  if (!isDark) {
    isDark = document.documentElement.classList.contains('dark');
  }
  
  if (type === 'background') {
    return isDark ? '#1e293b' : '#ffffff';
  } else if (type === 'text') {
    return isDark ? '#f8fafc' : '#1e293b';
  } else {
    return isDark ? '#475569' : '#e2e8f0';
  }
}

// Create a clean copy with only inline styles (no stylesheets)
function createCleanElementWithInlineStyles(element: HTMLElement): HTMLElement {
  const cleanCopy = element.cloneNode(true) as HTMLElement;
  
  function applyComputedStyles(original: Element, cloned: Element) {
    try {
      const origEl = original as HTMLElement;
      const cloneEl = cloned as HTMLElement;
      const computed = window.getComputedStyle(origEl);
      
      // Apply all important visual styles as inline styles
      cloneEl.style.display = computed.display;
      cloneEl.style.visibility = 'visible';
      cloneEl.style.opacity = '1';
      cloneEl.style.position = computed.position;
      cloneEl.style.top = computed.top;
      cloneEl.style.left = computed.left;
      cloneEl.style.width = computed.width;
      cloneEl.style.height = computed.height;
      cloneEl.style.minWidth = computed.minWidth;
      cloneEl.style.minHeight = computed.minHeight;
      cloneEl.style.maxWidth = computed.maxWidth;
      cloneEl.style.maxHeight = computed.maxHeight;
      cloneEl.style.margin = computed.margin;
      cloneEl.style.padding = computed.padding;
      cloneEl.style.borderWidth = computed.borderWidth;
      cloneEl.style.borderStyle = computed.borderStyle;
      cloneEl.style.borderRadius = computed.borderRadius;
      cloneEl.style.boxShadow = computed.boxShadow;
      cloneEl.style.fontSize = computed.fontSize;
      cloneEl.style.fontWeight = computed.fontWeight;
      cloneEl.style.fontFamily = computed.fontFamily;
      cloneEl.style.lineHeight = computed.lineHeight;
      cloneEl.style.textAlign = computed.textAlign;
      cloneEl.style.textDecoration = computed.textDecoration;
      cloneEl.style.letterSpacing = computed.letterSpacing;
      cloneEl.style.overflow = computed.overflow;
      cloneEl.style.flexDirection = computed.flexDirection;
      cloneEl.style.flexWrap = computed.flexWrap;
      cloneEl.style.justifyContent = computed.justifyContent;
      cloneEl.style.alignItems = computed.alignItems;
      cloneEl.style.gap = computed.gap;
      cloneEl.style.gridTemplateColumns = computed.gridTemplateColumns;
      cloneEl.style.gridTemplateRows = computed.gridTemplateRows;
      cloneEl.style.gridGap = computed.gridGap;
      cloneEl.style.transform = computed.transform === 'none' ? 'none' : 'none';
      
      // Fix colors - replace unsupported ones
      const bgColor = computed.backgroundColor;
      if (bgColor && !hasUnsupportedColor(bgColor)) {
        cloneEl.style.backgroundColor = bgColor;
      } else {
        cloneEl.style.backgroundColor = getFallbackColor(cloneEl, 'background');
      }
      
      const textColor = computed.color;
      if (textColor && !hasUnsupportedColor(textColor)) {
        cloneEl.style.color = textColor;
      } else {
        cloneEl.style.color = getFallbackColor(cloneEl, 'text');
      }
      
      const borderColor = computed.borderColor;
      if (borderColor && !hasUnsupportedColor(borderColor)) {
        cloneEl.style.borderColor = borderColor;
      } else {
        cloneEl.style.borderColor = getFallbackColor(cloneEl, 'border');
      }
      
      // Recursively apply to children
      const origChildren = Array.from(origEl.children);
      const cloneChildren = Array.from(cloneEl.children);
      for (let i = 0; i < origChildren.length && i < cloneChildren.length; i++) {
        applyComputedStyles(origChildren[i], cloneChildren[i]);
      }
    } catch {
      // Ignore errors
    }
  }
  
  applyComputedStyles(element, cleanCopy);
  return cleanCopy;
}

export async function downloadTicketPDF() {
  const ticketElement = document.getElementById("ticket-section");
  if (!ticketElement) {
    console.error("Ticket element not found");
    return;
  }

  let canvas: HTMLCanvasElement;
  let cleanElement: HTMLElement | null = null;

  try {
    // Ensure element is in viewport
    ticketElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    
    // Wait a moment for any animations/transitions
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a clean copy with only inline styles (no stylesheets to parse)
    cleanElement = createCleanElementWithInlineStyles(ticketElement);
    cleanElement.id = 'ticket-section-clean';
    cleanElement.style.position = 'absolute';
    cleanElement.style.left = '-9999px';
    cleanElement.style.top = '0';
    cleanElement.style.zIndex = '-9999';
    document.body.appendChild(cleanElement);
    
    // Wait a moment for DOM to update
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Use clean element with no stylesheets
    canvas = await html2canvas(cleanElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: true,
      foreignObjectRendering: false,
      removeContainer: true,
    });
    
    // Verify canvas has content
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas is empty - element may not be visible");
    }
  } catch (error: unknown) {
    console.error("PDF generation error:", error);
    
    // If error is about colors, try one more time with even more aggressive cleanup
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('color') || errorMessage.includes('lab') || errorMessage.includes('oklab')) {
      try {
        // Remove clean element and try again with original but remove all stylesheets in onclone
        if (cleanElement && cleanElement.parentNode) {
          cleanElement.parentNode.removeChild(cleanElement);
        }
        
        canvas = await html2canvas(ticketElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          allowTaint: true,
          foreignObjectRendering: false,
          onclone: (clonedDoc) => {
            // Remove ALL stylesheets to prevent color parsing
            try {
              const styleSheets = Array.from(clonedDoc.styleSheets);
              styleSheets.forEach((sheet) => {
                try {
                  if (sheet.ownerNode) {
                    sheet.ownerNode.parentNode?.removeChild(sheet.ownerNode);
                  }
                } catch {
                  // Ignore
                }
              });
            } catch {
              // Ignore
            }
            
            // Apply all styles as inline
            fixCSSColors(clonedDoc);
          },
        });
      } catch (retryError) {
        alert("Failed to generate PDF. Please try again.");
        throw retryError;
      }
    } else {
      alert("Failed to generate PDF. Please try again.");
      throw error;
    }
  } finally {
    // Clean up
    if (cleanElement && cleanElement.parentNode) {
      cleanElement.parentNode.removeChild(cleanElement);
    }
  }

  try {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const margin = 10;
    const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxHeight = pageHeight - 2 * margin;

    // If content fits on one page, add it directly
    if (pdfHeight <= maxHeight) {
      pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight, undefined, "FAST");
    } else {
      // Scale down to fit on one page
      const scale = maxHeight / pdfHeight;
      const scaledWidth = pdfWidth * scale;
      const scaledHeight = maxHeight;
      const xOffset = (pdfWidth - scaledWidth) / 2 + margin;
      pdf.addImage(imgData, "PNG", xOffset, margin, scaledWidth, scaledHeight, undefined, "FAST");
    }

    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    if (isIOS()) {
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 20000);
      return;
    }

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "BoogFlight-Eticket.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (error) {
    console.error("PDF download failed", error);
    alert("Failed to download PDF. Please try again.");
  }
}
