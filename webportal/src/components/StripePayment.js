import React from "react";
import {useState, useEffect} from "react";
import {useStripe, useElements, PaymentElement, Elements  } from "@stripe/react-stripe-js";
import StripeCheckout from "./StripeCheckout";
import {loadStripe} from "@stripe/stripe-js";
import { useAuth0 } from "@auth0/auth0-react";

// This component serves as the checkout form 
const StripePayment = (props) => {
    const setAllowConfirmation = props.setAllowConfirmation;
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    
    const [stripePromise] = useState(() => loadStripe("pk_test_51QMaBkK6acT5v5wcVhkePxrwXrGRuwJT6HHT4hbsOEg1RuF8rlxHjZCLjkHuzcGnJDcKrWNay2vIKDGjkrLnpFH100SPJwopdj"));
    const [clientSecret, setClientSecret] = useState(null);
    
    useEffect(() => {
        const fetchClientSecret = async () => {
            const response = await fetch(baseURL+"/api/checkout", {
                method: "POST",
            headers: {
                "Content-Type": "application/json", // Specify JSON format
            },
            body: JSON.stringify({price: props.amount, email: props.email, name: props.name}),
            });

            // console.log("JSON param", props.amount);

            const clientSecret = await response.text();
            setClientSecret(clientSecret);
        };

        if (props.amount)
        {
            fetchClientSecret();
        }

    }, [props.amount, props.email, props.name, baseURL]);

    return (
        <div>
            {stripePromise && clientSecret && (<Elements stripe={stripePromise} options={{clientSecret}}>
            <StripeCheckout setAllowConfirmation={setAllowConfirmation} />
</Elements>)}
        </div>
    )   
}

export default StripePayment; 