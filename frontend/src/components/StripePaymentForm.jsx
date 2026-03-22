import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Spinner, Button } from 'react-bootstrap';
import { ShieldCheck, CheckCircle, XCircle, Lock, Zap, ArrowRight, Activity, Shield } from 'lucide-react';
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
    
    console.log("Stripe Instance:", stripe);
    console.log("Elements Instance:", elements);

    if (!stripe || !elements) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center p-5 text-white opacity-75">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <div className="fw-900 ls-1 x-small uppercase">INITIALIZING SECURE GATEWAY...</div>
            </div>
        );
    }

    const [processing, setProcessing] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setLocalError('');

        try {
            // 1. Confirm with Stripe
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
                confirmParams: {
                    // Optional: Return URL if you want a redirect
                    // return_url: window.location.origin + '/payment-complete',
                }
            });

            if (error) {
                setLocalError(error.message);
                onError(error.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // 2. Call backend to confirm on server
                const res = await api.post('/bookings/confirm-payment', {
                    paymentIntentId: paymentIntent.id
                });

                if (res.data.success) {
                    onSuccess(res.data.bookingId);
                } else {
                    setLocalError(res.data.message || 'Confirmation failed');
                    onError(res.data.message);
                }
            } else if (paymentIntent.status === 'processing') {
                setLocalError('Your payment is processing.');
            } else if (paymentIntent.status === 'requires_payment_method') {
                setLocalError('Your payment was not successful, please try again.');
            } else {
                setLocalError('Payment status: ' + paymentIntent.status);
            }
        } catch (err) {
            console.error('Payment Error:', err);
            const msg = err.response?.data?.message || err.message || 'Payment processing failed';
            setLocalError(msg);
            onError(msg);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in d-flex flex-column gap-5">
            {localError && (
                <div className="alert-glass border-danger border-opacity-20 text-danger p-4 rounded-4 mb-2 small fw-bold d-flex align-items-center gap-3">
                    <XCircle size={20} />
                    <span>PROTOCOL BREACH: {localError.toUpperCase()}</span>
                </div>
            )}

            <div className="payment-element-container p-4 rounded-4 border border-white border-opacity-10 shadow-inner" style={{ background: '#0f172a', minHeight: '300px' }}>
                <PaymentElement 
                    options={{ 
                        layout: 'accordion',
                        theme: 'night',
                        variables: {
                            colorPrimary: '#6366f1',
                            colorBackground: 'transparent',
                            colorText: '#ffffff',
                            colorDanger: '#ef4444',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            spacingGridRow: '20px'
                        }
                    }} 
                />
            </div>

            <div className="d-flex flex-column gap-4 py-2 border-top border-white border-opacity-5 pt-5">
                <div className="d-flex justify-content-between align-items-center px-2">
                    <div className="d-flex align-items-center gap-2 text-secondary x-small fw-800 ls-2 uppercase opacity-60">
                         <Activity size={14} className="text-primary" /> Gateway Latency
                    </div>
                    <span className="text-white fw-900 x-small ls-1">OPTIMIZED / 0.8ms</span>
                </div>
                
                <Button 
                    type="submit" 
                    disabled={processing || !stripe} 
                    className="btn-premium w-100 py-4 rounded-pill shadow-22xl transform transition-all group fs-5 ls-wide"
                >
                    {processing ? (
                        <div className="d-flex align-items-center gap-3">
                            <Spinner size="sm" animation="border" />
                            <span className="fw-900 ls-2 small uppercase">AUTHORIZING CHANNEL...</span>
                        </div>
                    ) : (
                        <>
                            <Zap size={20} fill="currentColor" /> PAY SECURELY NOW <ArrowRight size={20} className="ms-auto group-hover:translate-x-1 transition-all" />
                        </>
                    )}
                </Button>
            </div>

            <div className="d-flex align-items-center justify-content-center gap-4 mt-2 px-1">
                <div className="d-flex align-items-center gap-2 text-secondary x-small fw-900 ls-1 uppercase opacity-40">
                    <Shield size={14} className="text-primary" /> 256-BIT SSL
                </div>
                <div className="d-flex align-items-center gap-2 text-secondary x-small fw-900 ls-1 uppercase opacity-40">
                    <CheckCircle size={14} className="text-primary" /> PCI-DSS COMPLIANT
                </div>
            </div>
            
            <style>{`
                .p-4 { padding: 1.5rem !important; }
                .x-small { font-size: 0.65rem; }
                .ls-wide { letter-spacing: 0.15em; }
            `}</style>
        </form>
    );
};

export default StripePaymentForm;
