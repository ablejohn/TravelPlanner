import React, { useEffect, useState } from "react";
import code from "https://js.getcode.com/v1";
import "./Button.css";

const Button = () => {
  const [paymentButton, setPaymentButton] = useState(null);

  useEffect(() => {
    const { button } = code.elements.create("button", {
      currency: "usd",
      destination: "AWKF7MP8PYcUicTo1makUkpVrMjzL9BULqeRQHG9ni6X",
      amount: 1,
    });

    setPaymentButton(button);

    return () => {
      button.unmount();
    };
  }, []);

  return (
    <div id="payment-button-container">
      <p>Purchase this trip plan for $1?</p>
      {paymentButton && paymentButton.mount("#payment-button-container")}
    </div>
  );
};

export default Button;
