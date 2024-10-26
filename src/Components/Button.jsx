import React, { useEffect, useState } from "react";
import code from "https://js.getcode.com/v1";
import "./Button.css";

const Button = ({ onPaymentVerified }) => {
  const [paymentButton, setPaymentButton] = useState(null);

  useEffect(() => {
    const { button } = code.elements.create("button", {
      currency: "usd",
      destination: "AWKF7MP8PYcUicTo1makUkpVrMjzL9BULqeRQHG9ni6X",
      amount: 1, // Amount in USD
    });

    button.on("success", () => {
      console.log("Payment successful");
      onPaymentVerified(); // Call the parent function to handle post-payment actions
      window.print(); // Trigger the print dialog after payment is verified
    });

    button.on("error", (error) => {
      console.error("Payment error:", error);
      alert("An error occurred during payment. Please try again."); // User feedback
    });

    setPaymentButton(button);

    return () => {
      button.unmount(); // Clean up the button on component unmount
    };
  }, [onPaymentVerified]);

  return (
    <div id="payment-button-container">
      {paymentButton && paymentButton.mount("#payment-button-container")}
    </div>
  );
};

export default Button;
