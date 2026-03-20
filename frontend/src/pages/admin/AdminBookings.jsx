import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Row, Col, Button } from 'react-bootstrap';
import { Calendar, User, Hotel, CreditCard, Activity, ArrowLeft, Filter, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/all');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader-container"><span className="loader"></span></div>;

    return (
        <div className="admin-bookings-page pb-5 animate-fade-in">
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="animate-slide-up">
                        <Link to="/admin/dashboard" className="text-secondary d-flex align-items-center gap-2 mb-3 text-decoration-none fw-bold small ls-1 opacity-75">
                            <ArrowLeft size={16} /> BACK TO COMMAND
                        </Link>
                        <h2 className="display-6 fw-900 gradient-text mb-0">Global Transaction Audit</h2>
                        <p className="text-secondary opacity-75 mt-2 fw-bold d-flex align-items-center gap-2">
                           <Globe size={14} className="text-primary" /> Synchronized booking repository across all sectors.
                        </p>
                    </div>
                </div>

                <div className="glass-card overflow-hidden shadow-2xl animate-slide-up-delay">
                    <div className="p-4 d-flex justify-content-between align-items-center border-bottom border-white border-opacity-5 bg-white bg-opacity-5">
                        <h5 className="fw-900 mb-0 text-white ls-tight d-flex align-items-center gap-2">
                             <CreditCard size={20} className="text-primary" /> Transaction Ledger
                        </h5>
                        <div className="d-flex gap-2">
                            <Badge bg="white" className="bg-opacity-10 text-secondary ls-1 px-3 py-2 small fw-bold">TOTAL ENTRIES: {bookings.length}</Badge>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <Table hover variant="dark" className="m-0 align-middle" style={{ background: 'transparent' }}>
                            <thead className="bg-white bg-opacity-5">
                                <tr>
                                    <th className="py-4 ps-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Primary Assets (Hotel/Room)</th>
                                    <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0">Identity Node</th>
                                    <th className="py-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-center">Payment Integrity</th>
                                    <th className="py-4 pe-4 text-secondary small text-uppercase fw-800 ls-2 border-0 text-end">Yield (INR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} className="border-bottom border-white border-opacity-5 transition-all">
                                        <td className="py-4 ps-4">
                                            <div className="d-flex align-items-center gap-4">
                                                <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                                                    <Hotel size={20} className="text-primary" />
                                                </div>
                                                <div>
                                                    <div className="fw-900 text-white fs-6 mb-1">{b.hotelId?.name || 'UNKNOWN ENTITY'}</div>
                                                    <div className="text-secondary x-small opacity-50 fw-bold ls-1 d-flex align-items-center gap-1 uppercase">
                                                       <Badge bg="white" className="bg-opacity-5 border border-white border-opacity-5 text-secondary">{b.roomTypeId?.type || 'STANDARD'}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="p-2 rounded-circle bg-white bg-opacity-5"><User size={14} className="text-secondary" /></div>
                                                <div>
                                                    <div className="text-white small fw-bold mb-1">{b.userId?.name || 'SYS_GUEST'}</div>
                                                    <div className="text-secondary x-small opacity-50 fw-bold font-monospace">{b.userId?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <Badge 
                                                bg={
                                                    b.paymentStatus === 'paid' ? 'success' : 
                                                    b.paymentStatus === 'refunded' ? 'info' : 
                                                    b.paymentStatus === 'failed' ? 'danger' : 'warning'
                                                } 
                                                className="bg-opacity-25 text-white px-4 py-2 rounded-pill small border border-white border-opacity-5 fw-bold ls-1 font-monospace"
                                            >
                                                {b.paymentStatus.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="py-4 pe-4 text-end">
                                            <div className="text-white fw-900 fs-6">₹ {b.totalAmount.toLocaleString()}</div>
                                            <div className="text-danger x-small fw-800 ls-1 mt-1 font-monospace lowercase">COMM: ₹ {(b.totalAmount * 0.10).toLocaleString()}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {bookings.length === 0 && (
                            <div className="text-center py-5">
                                <Activity size={48} className="text-secondary opacity-25 mb-3" />
                                <p className="text-secondary fw-bold small ls-1">NO TRANSFACTIONS DISCOVERED IN SECTOR.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default AdminBookings;
