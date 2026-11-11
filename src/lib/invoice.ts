import { formatDate, formatMoney, formatTime } from "@/lib/format";
import type { Booking } from "@/types/studio";

// jsPDF's default fonts only support basic characters.
function clean(value: string): string {
  return value.replace(/[^\x20-\x7E]/g, "?");
}

export async function downloadInvoice(booking: Booking): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const left = 20;
  const right = 190;
  let y = 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(180, 110, 0);
  doc.text("StudioSpace", left, y);

  doc.setFontSize(12);
  doc.setTextColor(90, 90, 90);
  doc.text("BOOKING INVOICE", right, y, { align: "right" });

  y += 8;
  doc.setDrawColor(210, 210, 210);
  doc.line(left, y, right, y);
  y += 12;

  const invoiceNumber = booking._id.slice(-8).toUpperCase();

  const rows: [string, string][] = [
    ["Invoice no.", `SS-${invoiceNumber}`],
    ["Booked on", formatDate(booking.createdAt.slice(0, 10))],
    ["Status", booking.status],
    ["Studio", clean(booking.studioTitle)],
    ["Location", clean(booking.studioLocation)],
    ["Booked by", clean(booking.userName || booking.userEmail)],
    ["Booker email", clean(booking.userEmail)],
    ["Host email", clean(booking.hostEmail)],
    ["Date", formatDate(booking.date)],
    [
      "Time",
      `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
    ],
  ];

  doc.setFontSize(11);
  for (const [label, value] of rows) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(label, left, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(value, 105) as string[];
    doc.text(lines, 75, y);
    y += 8 + (lines.length - 1) * 5.5;
  }

  y += 4;
  doc.line(left, y, right, y);
  y += 12;

  const money: [string, string][] = [
    ["Hourly rate", formatMoney(booking.hourlyRate)],
    ["Hours booked", String(booking.hours)],
    ["Security deposit (not included in total)", formatMoney(booking.securityDeposit)],
  ];

  doc.setFontSize(11);
  for (const [label, value] of money) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(label, left, y);
    doc.setTextColor(0, 0, 0);
    doc.text(value, right, y, { align: "right" });
    y += 8;
  }

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Total", left, y);
  doc.text(formatMoney(booking.totalPrice), right, y, { align: "right" });

  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Thank you for booking with StudioSpace.", left, y);

  doc.save(`studiospace-invoice-${invoiceNumber}.pdf`);
}