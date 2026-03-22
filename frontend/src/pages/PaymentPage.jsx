import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Container, Row, Col, Card } from "react-bootstrap";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import StripePaymentForm from "../components/StripePaymentForm";

// Initialize Stripe outside component to avoid repeated calls
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state || !state.clientSecret) {
        return (
            <Container className="py-5 mt-5 text-center">
                <div className="glass-card p-5 border-danger border-opacity-25">
                    <h3 className="text-white fw-900 mb-3">SECURE ACCESS DENIED</h3>
                    <p className="text-secondary fw-bold small ls-1">NO ACTIVE PAYMENT SESSION LOCATED IN YOUR SECTOR.</p>
                    <button onClick={() => navigate('/')} className="mt-4 btn btn-outline-primary rounded-pill px-5 fw-bold">Return to Explorer</button>
                </div>
            </Container>
        );
    }

    return (
        <div className="payment-page py-5 min-vh-100 animate-fade-in" style={{ 
            background: 'radial-gradient(circle at top right, rgba(99,102,241,0.05), transparent), radial-gradient(circle at bottom left, rgba(139,92,246,0.05), transparent)' 
        }}>
            <Container className="mt-5 pt-4">
                <Row className="justify-content-center">
                    <Col lg={6} md={8}>
                        <div className="animate-slide-up">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="text-secondary p-0 mb-4 d-flex align-items-center gap-2 text-decoration-none opacity-75 hover-opacity-100 transition-all border-0 bg-transparent fw-bold small ls-1"
                            >
                                <ArrowLeft size={16} /> ABORT TRANSACTION
                            </button>

                            <Card className="glass-card border-white border-opacity-10 shadow-22xl overflow-hidden">
                                <Card.Body className="p-5">
                                    <div className="text-center mb-5">
                                        <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle text-primary mb-4 animate-pulse-slow">
                                            <Lock size={32} />
                                        </div>
                                        <h2 className="display-6 fw-900 text-white mb-2 ls-tight">Secure Checkout</h2>
                                        <p className="text-secondary fw-bold small ls-1">FINALIZING YOUR LUXURY STAY RESERVATION</p>
                                    </div>

                                    <div className="alert-glass mb-5 p-4 rounded-4 border border-white border-opacity-5 d-flex align-items-center gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <div className="text-warning"><ShieldCheck size={20} /></div>
                                        <div className="text-secondary small fw-bold ls-05">
                                            Your transaction is encrypted with military-grade SSL. No payment data is stored on our servers.
                                        </div>
                                    </div>

                                    <Elements 
                                        stripe={stripePromise} 
                                        options={{ 
                                            clientSecret: state.clientSecret,
                                            appearance: {
                                                theme: 'night',
                                                variables: {
                                                    colorPrimary: '#6366f1',
                                                    colorBackground: '#0f172a',
                                                    colorText: '#ffffff',
                                                    colorDanger: '#ef4444',
                                                    fontFamily: 'Outfit, Inter, sans-serif',
                                                }
                                            }
                                        }}
                                    >
                                        <StripePaymentForm
                                            clientSecret={state.clientSecret}
                                            paymentIntentId={state.paymentIntentId}
                                            onSuccess={(bookingId) => {
                                                console.log("✅ Booking Success Event Emitted:", bookingId);
                                                navigate("/my-bookings");
                                            }}
                                            onError={(err) => {
                                                console.error("❌ Payment Submission Error Received:", err);
                                            }}
                                        />
                                    </Elements>
                                </Card.Body>
                            </Card>

                            <p className="text-center text-secondary small mt-5 opacity-75 fw-bold ls-1 uppercase font-monospace">
                                StaySphere Protocol v2.4.0 · Transaction Secured
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PaymentPage;