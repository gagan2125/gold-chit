import React from "react";
import GeneralExport from "../exportComponentFormats/GeneralExport";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PaymentPrint = ({ printDetails }) => {
  const {
    customerName,
    groupName,
    ticketNumber,
    receiptNumber,
    paymentDate,
    paymentMode,
    transactionId,
    amount,
  } = printDetails;
  const downloadPdf = async () => {
    try {
      const receiptElement = document.getElementById("receipt");
      const canvas = await html2canvas(receiptElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/JPEG");

      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
      pdf.save("Receipt.pdf");
    } catch (err) {
      console.log("Failed to create PDF");
    }
  };
  const sendGmail = () => {


  };
  const printReceipt = () => {
    window.print()
  };

  const receiptData = {
    companyName: "MyChits",
    companyAddress: `No.11/36-25, 2nd Main, Kathriguppe Main Road,
Bangalore, 560085`,
    companyContact: "Tel: 9483900777 | Email: info.mychit@gmail.com",
  };
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f3f4f6",
      padding: "40px",
      display: "flex",
      width: "100vw",
      justifyContent: "center",
      alignItems: "center",
    },
    receipt: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "40px",
      maxWidth: "800px",
      width: "900px",
      position: "relative",
      "@media print": {
        boxShadow: "none",
        borderRadius: 0,
        padding: "20px",
      },
    },
    logo: {
      // position: "absolute",
      // top: "24px",
      // left: "290px",
      maxWidth: "50px",
    },
    header: {
      textAlign: "center",
      borderBottom: "2px solid #1e40af",
      paddingBottom: "20px",
      marginBottom: "30px",
    },
    title: {
      color: "#1e40af",
      margin: 0,
      fontSize: "28px",
      fontWeight: "bold",
    },
    detailRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "20px",
      placeItems: "center",
    },
    totalSection: {
      backgroundColor: "#1e40af",
      color: "white",
      padding: "16px",
      borderRadius: "8px",
      margin: "24px 0",
    },
    signature: {
      borderTop: "2px solid #1e40af",
      width: "200px",
      marginTop: "40px",
      paddingTop: "10px",
      textAlign: "right",
      float: "right",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.receipt} id="receipt">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <img
            src="data:image/jpeg;base64,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"
            alt="Company Logo"
            style={styles.logo}
          />
          <div style={styles.header}>
            <h1 style={styles.title}>{receiptData.companyName}</h1>
            <p style={{ color: "#6b7280", margin: "8px 0" }}>
              {receiptData.companyAddress}
            </p>
            <p style={{ color: "#6b7280" }}>{receiptData.companyContact}</p>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <div style={styles.detailRow}>
            <div>
              <p style={{ fontWeight: "600", margin: "8px 0" }}>
                Customer Name
              </p>
              <p>{customerName}</p>
            </div>
            <div>
              <p style={{ fontWeight: "600", margin: "8px 0" }}>Group Name</p>
              <p>{groupName}</p>
            </div>
          </div>

          <div style={styles.detailRow}>
            <div>
              <p style={{ fontWeight: "600", margin: "8px 0" }}>
                Ticket Number
              </p>
              <p>{ticketNumber}</p>
            </div>
            <div>
              <p style={{ fontWeight: "600", margin: "8px 0" }}>
                Receipt Number
              </p>
              <p>{receiptNumber}</p>
            </div>
          </div>

          <div style={styles.detailRow}>
            <div>
              <p style={{ fontWeight: "600", margin: "8px 0" }}>Payment Date</p>
              <p>{paymentDate}</p>
            </div>
            <div>
              <p style={{ fontWeight: "600", margin: "8px 0" }}>Payment Mode</p>
              <p>{paymentMode}</p>
            </div>
          { transactionId && <div>
              <p style={{ fontWeight: "600", margin: "8px 0" }}>Transaction Id</p>
              <p>{transactionId}</p>
            </div>}
          </div>
        </div>

        <div style={styles.totalSection}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Amount</span>
            <span>{`₹ ${amount}`}</span>
          </div>
        </div>

        <div style={styles.signature}>
          <p style={{ margin: "0 0 8px 0" }}>Authorized Signature</p>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            {receiptData.authorizedSignatory}
            <br />
            {receiptData.designation}
          </p>
        </div>

        <div
          style={{
            clear: "both",
            textAlign: "center",
            color: "#6b7280",
            marginTop: "40px",
            fontSize: "14px",
          }}
        >
          This is a computer generated receipt and does not require a physical
          signature
        </div>
      </div>
      <GeneralExport
        onDownloadPdf={downloadPdf}
        onSendGmail={sendGmail}
        onPrintReceipt={printReceipt}
      />
    </div>
  );
};

export default PaymentPrint;
