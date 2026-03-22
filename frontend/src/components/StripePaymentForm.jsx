import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Spinner } from 'react-bootstrap';
import { ShieldCheck, CheckCircle, XCircle, Lock } from 'lucide-react';
import api from '../services/api';

/**
 * StripePaymentForm
 * Props:
 *  - clientSecret      : Stripe PaymentIntent clientSecret
 *  - paymentIntentId   : Stripe PaymentIntent ID
 *  - onSuccess(bookingId) : called when booking is fully confirmed
 *  - onError(msg)      : called on any error
 */
const StripePaymentForm = ({ clientSecret, paymentIntentId, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setLocalError('');

        // 1. Confirm the payment with Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });

        if (error) {
            setLocalError(error.message || 'Payment failed. Please try again.');
            setProcessing(false);
            onError(error.message || 'Payment failed.');
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            try {
                // 2. Confirm booking on our backend
                const res = await api.post('/bookings/confirm-payment', {
                    paymentIntentId: paymentIntent.id
                });
                if (res.data.success) {
                    onSuccess(res.data.bookingId);
                }
            } catch (backendErr) {
                const msg = backendErr.response?.data?.message || 'Booking confirmation failed.';
                setLocalError(msg);
                onError(msg);
            }
        } else {
            const msg = `Unexpected payment status: ${paymentIntent.status}`;
            setLocalError(msg);
            onError(msg);
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} id="stripe-payment-form">
            {/* Stripe auto-renders card/UPI/etc. based on capabilities */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px'
            }}>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                        style: {
                            base: {
                                color: '#ffffff',
                                fontSize: '16px',
                                fontFamily: 'Inter, sans-serif',
                                '::placeholder': { color: 'rgba(255,255,255,0.4)' }
                            }
                        }
                    }}
                />
            </div>

            {localError && (
                <div style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#ef4444',
                    fontSize: '13px',
                    fontWeight: '700',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <XCircle size={16} /> {localError}
                </div>
            )}

            <button
                type="submit"
                id="stripe-pay-now-btn"
                disabled={!stripe || processing}
                style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '50px',
                    border: 'none',
                    background: processing
                        ? 'rgba(99,102,241,0.5)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                    fontWeight: '900',
                    fontSize: '16px',
                    letterSpacing: '1px',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: processing ? 'none' : '0 8px 32px rgba(99,102,241,0.4)',
                    transition: 'all 0.3s ease'
                }}
            >
                {processing ? (
                    <>
                        <Spinner size="sm" animation="border" />
                        PROCESSING...
                    </>
                ) : (
                    <>
                        <Lock size={18} />
                        PAY SECURELY NOW
                    </>
                )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', opacity: 0.5 }}>
                <ShieldCheck size={13} style={{ color: '#6366f1' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>
                    SECURED BY STRIPE · 256-BIT SSL ENCRYPTION
                </span>
            </div>
        </form>
    );
};

export default StripePaymentForm;
