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
 
    
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const fetchStripeAccount = async () => {
            const response = await fetch(baseURL+"/api/find-or-create-account-number",
                {method: "POST", 
                headers: {
                    "Content-Type": "application/json", // Specify JSON format
                },
                body: JSON.stringify({name: props.receiver}),
                }
            );
    
            const accountNumber =  await response.text();
            const stripe = loadStripe('pk_test_51QMaBkK6acT5v5wcVhkePxrwXrGRuwJT6HHT4hbsOEg1RuF8rlxHjZCLjkHuzcGnJDcKrWNay2vIKDGjkrLnpFH100SPJwopdj',
                {stripeAccount: accountNumber,});
            setStripePromise(stripe);
        }
        fetchStripeAccount();
    }, [props.receiver, baseURL]);
    
    useEffect(() => {
        const fetchClientSecret = async () => {
            const response = await fetch(baseURL+"/api/checkout", {
                method: "POST",
            headers: {
                "Content-Type": "application/json", // Specify JSON format
            },
            body: JSON.stringify({price: props.amount, email: props.email, name: props.name, receiver: props.receiver}),
            });

            // console.log("JSON param", props.amount);

            const clientSecret = await response.text();
            // console.log(clientSecret);
            setClientSecret(clientSecret);
        };

        if (props.amount)
        {
            fetchClientSecret();
        }

    }, [props.amount, props.email, props.name, baseURL, props.receiver]);

    return (
        <div>
            {/* {console.log(stripePromise)} */}
            {(stripePromise && clientSecret) && (<Elements stripe={stripePromise} options={{clientSecret}}>
            <StripeCheckout setAllowConfirmation={setAllowConfirmation} />
</Elements>)}
        </div>
    )   
}

export default StripePayment; 