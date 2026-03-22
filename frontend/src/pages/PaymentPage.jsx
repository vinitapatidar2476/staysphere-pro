import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../components/StripePaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    if (!state) {
        return <h3>No payment data found</h3>;
    }

    return (
        <div style={{ padding: "50px", maxWidth: "500px", margin: "auto" }}>
            <h2 style={{ color: "white", marginBottom: "20px" }}>Complete Payment</h2>

            <Elements options={{ clientSecret: state.clientSecret }} stripe={stripePromise}>
                <StripePaymentForm
                    clientSecret={state.clientSecret}
                    paymentIntentId={state.paymentIntentId}
                    onSuccess={(bookingId) => {
                        navigate("/my-bookings");
                    }}
                    onError={(err) => {
                        alert(err);
                    }}
                />
            </Elements>
        </div>
    );
};

export default PaymentPage;