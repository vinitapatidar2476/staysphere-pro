import React, { useEffect } from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShieldCheck, MapPin, Calendar, Layout } from 'lucide-react';
import confetti from 'canvas-confetti';

const BookingSuccess = () => {
    const { state } = useLocation();
    const bookingId = state?.bookingId || 'SEC-NODE-XXXX';

    useEffect(() => {
        // Trigger cinematic celebration
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#f43f5e', '#ffffff']
        });
    }, []);

    return (
        <div className="login-page min-vh-100 d-flex align-items-center py-5 animate-fade-in" style={{
            background: 'radial-gradient(circle at center, rgba(99,102,241,0.1), transparent 70%)'
        }}>
            <Container className="text-center">
                <div className="animate-slide-up">
                    <div className="mb-5 d-inline-flex position-relative">
                        <div className="position-absolute top-50 start-50 translate-middle w-150 h-150 bg-primary opacity-20 blur-3xl rounded-circle animate-pulse-soft"></div>
                        <CheckCircle size={120} className="text-primary position-relative shadow-primary-glow" strokeWidth={1} />
                    </div>
                    
                    <h1 className="display-3 fw-900 text-white ls-tight mb-3">CONGRATULATIONS.</h1>
                    <p className="text-secondary fw-800 fs-5 ls-2 uppercase mb-5 opacity-80">
                        RESERVATION PROTOCOL AUTHORIZED & SYNCED.
                    </p>

                    <Card className="glass-panel p-4 p-md-5 rounded-5 border-white border-opacity-10 shadow-22xl max-w-lg mx-auto mb-5 translate-y-n2 animate-slide-up-delay">
                        <div className="text-start d-flex flex-column gap-4">
                            <div className="d-flex align-items-center gap-4 border-bottom border-white border-opacity-5 pb-4">
                                <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary"><ShieldCheck size={28} /></div>
                                <div>
                                    <div className="text-secondary x-small fw-900 ls-2 uppercase mb-1">Authorization Node</div>
                                    <div className="text-white fw-800 fs-5">#{bookingId.slice(-10).toUpperCase()}</div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-4">
                                <div className="p-3 bg-white bg-opacity-5 rounded-4 text-white"><Calendar size={28} /></div>
                                <div className="text-start">
                                    <div className="text-secondary x-small fw-900 ls-2 uppercase mb-1">Deployment Status</div>
                                    <div className="text-white fw-800">100% OPERATIONAL RECOVERY</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-5 border-top border-white border-opacity-5 d-flex flex-column gap-3">
                            <Button as={Link} to="/my-bookings" className="btn-premium py-3 rounded-pill fs-6 ls-wide d-flex align-items-center justify-content-center gap-3">
                                <Layout size={20} /> VIEW RESERVATION LEDGER
                            </Button>
                            <Button as={Link} to="/" variant="outline-premium" className="py-3 rounded-pill fs-6 ls-wide d-flex align-items-center justify-content-center gap-3">
                                CONTINUE EXPLORING <ArrowRight size={20} />
                            </Button>
                        </div>
                    </Card>

                    <div className="text-secondary x-small fw-900 ls-1 uppercase opacity-40 font-monospace">
                        Secured StaySphere Auth v4.2 · Zero Trust Architecture
                    </div>
                </div>
            </Container>

            <style>{`
                .w-150 { width: 150px; }
                .h-150 { height: 150px; }
                .translate-y-n2 { transform: translateY(-10px); }
            `}</style>
        </div>
    );
};

export default BookingSuccess;
