// src/lib/downloadTicketPDF.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export async function downloadTicketPDF() {
  const ticketElement = document.getElementById("ticket-section");
  if (!ticketElement) return;

  if (!isMobile()) {
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(ticketElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

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

    pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight, undefined, "FAST");

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
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (error) {
    console.error("PDF download failed", error);
    window.print();
  }
}
