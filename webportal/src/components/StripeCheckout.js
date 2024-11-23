import React from "react";
import {useStripe, useElements, PaymentElement, Elements  } from "@stripe/react-stripe-js";


const StripeCheckout = () => {

    const stripe = useStripe();
    const elements = useElements();

    const submit = async (event) => {

    event.preventDefault();

    if (!stripe || !elements) {
        return;
    }

   

    

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
        //   return_url: `${window.location.origin}/completion`,
        
        },
        redirect: 'if_required'
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        console.log(error.message);
      } else {
        console.log("An unexpected error occured.");
      }

    
}  
    return (
        <div>
            <h1>Checkout</h1>
            <PaymentElement/>
            <button onClick={submit}>Pay</button>
        </div>
    );
}

export default StripeCheckout;