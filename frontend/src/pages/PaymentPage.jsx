import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { ShieldCheck, ArrowLeft, Lock, Award, Clock, Layers, Zap, Info } from "lucide-react";
import StripePaymentForm from "../components/StripePaymentForm";

// Initialize Stripe
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log("Stripe Key Detected:", STRIPE_KEY ? "YES (starts with " + STRIPE_KEY.substring(0, 8) + ")" : "NO");
const stripePromise = loadStripe(STRIPE_KEY);

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!STRIPE_KEY) console.error("FATAL: Stripe Publishable Key is missing from environment variables.");
    }, []);

    if (!state || !state.clientSecret) {
        return (
            <div className="min-vh-100 d-flex align-items-center bg-slate-950 animate-fade-in">
                <Container className="py-20 text-center">
                    <div className="glass-panel p-5 p-md-10 rounded-5 border-danger border-opacity-10 max-w-2xl mx-auto shadow-22xl">
                        <div className="bg-danger bg-opacity-10 p-5 rounded-circle d-inline-block mb-4">
                            <Lock size={60} className="text-danger animate-pulse-soft" />
                        </div>
                        <h3 className="text-white fw-900 display-5 mb-3 ls-tight">SECURE ACCESS DENIED</h3>
                        <p className="text-secondary fw-bold small ls-2 uppercase opacity-50 mb-5">NO ACTIVE PAYMENT SESSION LOCATED IN YOUR SECTOR.</p>
                        <button onClick={() => navigate('/')} className="btn-premium px-10 rounded-pill bg-danger border-0">RETURN TO BASE</button>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="payment-page py-5 min-vh-100 animate-fade-in bg-slate-950">
            <div className="hero-glow-1 position-absolute top-0 start-0 w-100 h-100 opacity-20 pointer-events-none"></div>
            
            <Container>
                <Row className="justify-content-center">
                    <Col lg={10} xl={8}>
                        <div className="animate-slide-up">
                            <div className="d-flex justify-content-between align-items-end mb-4 px-2">
                                <div>
                                    <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-1 rounded-pill fw-800 ls-2 mb-3 border border-primary border-opacity-10 uppercase small">
                                        SECURE PROTOCOL V4.2
                                    </Badge>
                                    <h2 className="display-5 fw-800 text-white ls-tight mb-0">Initialize Settlement<span className="text-primary">.</span></h2>
                                </div>
                                <button 
                                    onClick={() => navigate(-1)} 
                                    className="text-secondary p-0 d-flex align-items-center gap-2 text-decoration-none transition-all border-0 bg-transparent fw-800 small ls-2 uppercase hover-text-white"
                                >
                                    <ArrowLeft size={16} /> ABORT SESSION
                                </button>
                            </div>

                            <Row className="g-4">
                                <Col lg={6}>
                                    <Card className="glass-panel border-white border-opacity-5 rounded-5 shadow-22xl overflow-hidden h-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                        <Card.Body className="p-4 p-xl-5">
                                            <div className="d-flex align-items-center gap-3 mb-5 pb-2">
                                                <div className="bg-primary bg-opacity-10 p-3 rounded-4"><Layers size={24} className="text-primary" /></div>
                                                <h4 className="fw-900 text-white mb-0 uppercase ls-1">Asset Allocation</h4>
                                            </div>

                                            <div className="d-flex flex-column gap-5 mb-5 pb-4">
                                                <div>
                                                    <div className="text-secondary x-small fw-800 ls-2 uppercase mb-2 opacity-50 text-dim">Selected Target</div>
                                                    <div className="text-white fw-900 fs-4 ls-tight uppercase">{state.hotelName || 'ELITE STAY NODE'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-secondary x-small fw-800 ls-2 uppercase mb-2 opacity-50 text-dim">Resource Tier</div>
                                                    <div className="text-white fw-900 fs-5 ls-tight uppercase">{state.roomType || 'LUXURY UNIT'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-secondary x-small fw-800 ls-2 uppercase mb-2 opacity-50 text-dim">Settlement Total</div>
                                                    <div className="d-flex align-items-end gap-2">
                                                        <div className="text-primary fw-900 display-6 lh-1">₹{state.amount?.toLocaleString()}</div>
                                                        <div className="text-secondary small fw-bold ls-1 mb-1">INR</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="alert-glass mt-auto mb-2 p-4 rounded-4 border border-white border-opacity-5 d-flex align-items-center gap-4 transition-all hover:bg-opacity-10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div className="text-primary p-2 bg-primary bg-opacity-10 rounded-circle animate-pulse-soft"><ShieldCheck size={26} /></div>
                                                <div className="text-white small fw-700 font-outfit ls-05 opacity-80">
                                                    Your transaction is encrypted with 256-bit SSL protocol. No data is stored on external caches.
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg={6}>
                                    <Card className="glass-panel border-primary border-opacity-20 rounded-5 shadow-22xl overflow-hidden h-100 animate-fade-in shadow-primary-glow" style={{ animationDelay: '0.3s' }}>
                                        <Card.Body className="p-4 p-xl-5">
                                            <div className="d-flex align-items-center justify-content-between mb-5 pb-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-primary bg-opacity-10 p-3 rounded-4"><Zap size={24} className="text-primary" fill="currentColor" /></div>
                                                    <h4 className="fw-900 text-white mb-0 uppercase ls-1">Secure Gateway</h4>
                                                </div>
                                                <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-3 py-1 fw-900 border border-success border-opacity-20">ENCRYPTED</Badge>
                                            </div>

                                            <Elements 
                                                stripe={stripePromise} 
                                                options={{ 
                                                    clientSecret: state.clientSecret,
                                                    appearance: {
                                                        theme: 'night',
                                                        variables: {
                                                            colorPrimary: '#6366f1',
                                                            colorBackground: 'transparent',
                                                            colorText: '#ffffff',
                                                            fontFamily: 'Plus Jakarta Sans, sans-serif',
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
                                </Col>
                            </Row>

                            <p className="text-center text-secondary x-small mt-10 opacity-30 fw-bold ls-2 uppercase font-monospace pt-5">
                                StaySphere Settlement Protocol v3.8.4.1 · Quantum Verified
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
            
            <style>{`
                .ls-2 { letter-spacing: 0.2em; }
                .x-small { font-size: 0.65rem; }
                .text-dim { color: #475569; }
                .p-10 { padding: 5rem !important; }
            `}</style>
        </div>
    );
};

export default PaymentPage;