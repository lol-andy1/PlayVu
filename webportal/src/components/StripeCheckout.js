import React from "react";
import {useStripe, useElements, PaymentElement, Elements  } from "@stripe/react-stripe-js";
import Button from '@mui/material/Button';

const StripeCheckout = (props) => {
    const { setAllowConfirmation } = props;

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

        },
        redirect: 'if_required'
      });

    if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
            console.error(error.message);
            } else {
            console.error("An unexpected error occured.");
            }
    } else {
        setAllowConfirmation(true);
    }
}  
    return (
        <div className="flex flex-col gap-4 p-10">
            <PaymentElement/>
            <Button className="w-10" variant="contained" color="success" onClick={submit}>Pay</Button>
        </div>
    );
}

export default StripeCheckout;