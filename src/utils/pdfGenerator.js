/**
 * pdfGenerator.js — generate & download PDF receipt using jsPDF + html2canvas
 */

export async function downloadReceiptPDF(bill, receiptElementId = "receipt-content") {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  const element = document.getElementById(receiptElementId);
  if (!element) return;

  // Temporarily make it visible for capture
  const prevDisplay = element.style.display;
  const prevPos = element.style.position;
  element.style.display = "block";
  element.style.position = "fixed";
  element.style.top = "-9999px";
  element.style.left = "-9999px";
  element.style.width = "600px";
  element.style.zIndex = "-1";
  element.style.background = "#fff";

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = 10;
    const y = 10;

    if (imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    } else {
      // Multi-page support
      let remaining = imgHeight;
      let srcY = 0;
      while (remaining > 0) {
        const sliceHeight = Math.min(pageHeight - 20, remaining);
        const srcSlice = (sliceHeight / imgHeight) * canvas.height;
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcSlice;
        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcSlice, 0, 0, canvas.width, srcSlice);
        const sliceData = sliceCanvas.toDataURL("image/png");
        pdf.addImage(sliceData, "PNG", x, y, imgWidth, sliceHeight);
        remaining -= sliceHeight;
        srcY += srcSlice;
        if (remaining > 0) pdf.addPage();
      }
    }

    const safeHotel = bill.hotelName.replace(/[^a-zA-Z0-9]/g, "-");
    pdf.save(`Carry-Bill-${bill.invoiceNo}-${safeHotel}.pdf`);
  } finally {
    element.style.display = prevDisplay;
    element.style.position = prevPos;
    element.style.top = "";
    element.style.left = "";
    element.style.width = "";
    element.style.zIndex = "";
    element.style.background = "";
  }
}
