import { forwardRef } from "react";
import useAuthStore from "../stores/useAuthStore";

const PrintableReceipt = forwardRef(({ order, response }, ref) => {
  const { user } = useAuthStore();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "monospace",
        fontSize: "12px",
        maxWidth: "300px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #000",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "18px", margin: 0 }}>🍴 Yumventures</h2>
                <p style={{ margin: "5px 0" }}>1375 San Marcelino St</p>
                <p style={{ margin: "5px 0" }}>Paco, Manila, 1006 Metro Manila</p>
                <p style={{ margin: "5px 0" }}>Tel: +63 949 890 4543</p>
            </div>

      <div
        style={{ borderTop: "1px dashed #000", margin: "10px 0" }}
      ></div>

      {/* Info */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <span>Order ID: {response.order.id}</span>
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
        <div>
          <span>Cashier: {user.firstName}{user.lastName}</span>
        </div>
      </div>

      <div
        style={{ borderTop: "1px dashed #000", margin: "10px 0" }}
      ></div>

      {/* Ordered Items */}
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Item</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.orderedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td style={{ textAlign: "center" }}>{item.quantity}</td>
                <td style={{ textAlign: "right" }}>₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{ borderTop: "1px dashed #000", margin: "10px 0" }}
      ></div>

      {/* Summary */}
      <div>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>Total</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>
                ₱{response.order.total.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td>Tendered</td>
              <td style={{ textAlign: "right" }}>
                ₱{response.order.tenderedAmount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td>Change</td>
              <td style={{ textAlign: "right" }}>₱{response.order.change.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{ borderTop: "1px dashed #000", margin: "10px 0" }}
      ></div>

      {/* Footer */}
      <div style={{ textAlign: "center" }}>
        <p style={{ marginTop: "10px", fontSize: "14px", fontWeight: "bold" }}>
          🎉 THANK YOU! 🎉
        </p>
        <p>Please come again.</p>
      </div>
    </div>
  );
});

export default PrintableReceipt;

