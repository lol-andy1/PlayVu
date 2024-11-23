import React from "react";
import {useState, useEffect} from "react";
import {useStripe, useElements, PaymentElement, Elements  } from "@stripe/react-stripe-js";
import StripeCheckout from "./StripeCheckout";
import {loadStripe} from "@stripe/stripe-js";
  
// const publishableKey = "pk_test_51QMaBkK6acT5v5wcVhkePxrwXrGRuwJT6HHT4hbsOEg1RuF8rlxHjZCLjkHuzcGnJDcKrWNay2vIKDGjkrLnpFH100SPJwopdj";

// This component serves as the checkout form 
const StripePayment = (props) => { // Add prop for success/failure of transaction
    const setAllowConfirmation = props.setAllowConfirmation;
    const amount = props.amount; // NOTE THIS IS IN CENTS NOT DOLLARS!!!
    // const allowConfirmation = props.allowConfirmation;
    //const success = props.success; // THIS IS bool, and updates if success
    // EMAIL and NAME are also props

    const baseURL = process.env.REACT_APP_BACKEND_URL;
    
    const [stripePromise] = useState(() => loadStripe("pk_test_51QMaBkK6acT5v5wcVhkePxrwXrGRuwJT6HHT4hbsOEg1RuF8rlxHjZCLjkHuzcGnJDcKrWNay2vIKDGjkrLnpFH100SPJwopdj"));


    const [clientSecret, setClientSecret] = useState(null);
    // console.log(JSON.stringify({price: amount, email: props.email, name: props.name}));
    
    useEffect(() => {
        const fetchClientSecret = async () => {
            const response = await fetch(baseURL+"/api/checkout", {
                method: "POST",
            headers: {
                "Content-Type": "application/json", // Specify JSON format
            },
            body: JSON.stringify({price: amount, email: props.email, name: props.name}),
            });

            const clientSecret = await response.text();
            setClientSecret(clientSecret);
        };

        fetchClientSecret();
    }, [amount, props.email, props.name, baseURL]);

    console.log("Client Secret",clientSecret);

    return (
        <div>
            {stripePromise && clientSecret && (<Elements stripe={stripePromise} options={{clientSecret}}>
            <StripeCheckout setAllowConfirmation={setAllowConfirmation} />
</Elements>)}
        </div>
    )   
}

export default StripePayment; 