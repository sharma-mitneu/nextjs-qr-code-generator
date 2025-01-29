import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const [link, setLink] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  // Function to validate URL
  const isValidURL = (url: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // Optional http or https
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // Domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IPv4 Address
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*" + // Port and path
        "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" + // Query string
        "(\\#[-a-zA-Z\\d_]*)?$", // Fragment locator
      "i"
    );
    return pattern.test(url);
  };

  const generateQRCode = () => {
    if (!link.trim()) {
      setError("Please enter a URL!");
      return;
    }

    if (!isValidURL(link)) {
      setError("Invalid URL! Please enter a valid link.");
      return;
    }

    setError(""); // Clear any previous errors
    setQrValue(link);
  };

  const clearQRCode = () => {
    setLink("");
    setQrValue("");
    setError("");
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      // Use type assertion to specify the type of element
      const canvas = qrRef.current?.querySelector<HTMLCanvasElement>('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png')
        
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.download = 'qrcode.png'
        link.href = url
        link.click()
      }
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>QR Code Generator</h1>
      <input
        type="text"
        placeholder="Enter a valid link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "10px",
          border: error ? "2px solid red" : "1px solid black",
        }}
      />
      <br />
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <button
        onClick={generateQRCode}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        Generate QR Code
      </button>
      {qrValue && (
        <>
          <div ref={qrRef} style={{ marginTop: "20px" }}>
  <QRCodeCanvas value={qrValue} size={256} />
</div>
          <br />
          <button
            onClick={downloadQRCode}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              border: "none",
              marginRight: "10px",
            }}
          >
            Download QR Code
          </button>
          <button
            onClick={clearQRCode}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: "red",
              color: "white",
              border: "none",
            }}
          >
            Clear QR Code
          </button>
        </>
      )}
    </div>
  );
}
