import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Modal, Form, Badge, Spinner, Row, Col } from 'react-bootstrap';
import { Edit, Trash2, Plus, Hotel, MapPin, Search, Image as ImageIcon, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import ManageRooms from './ManageRooms';

const ManageHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', city: '', address: '', description: '', amenities: '', imageUrl: ''
    });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const res = await api.get('/hotels/manager');
            setHotels(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleEdit = (hotel) => {
        setEditId(hotel._id);
        const amenitiesStr = hotel.amenities ? (Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : hotel.amenities) : '';
        setFormData({
            name: hotel.name,
            city: hotel.city,
            address: hotel.address,
            description: hotel.description,
            amenities: amenitiesStr,
            imageUrl: hotel.images?.[0] || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Action will permanently remove this property. Proceed?')) {
            try {
                await api.delete(`/hotels/${id}`);
                fetchHotels();
            } catch (err) {
                console.error(err);
                alert('Property deletion failed. Please try again.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Clean up data for backend
            const { imageUrl, ...rest } = formData;
            const data = {
                ...rest,
                amenities: formData.amenities.split(',').map(item => item.trim()).filter(i => i),
                images: formData.imageUrl ? [formData.imageUrl] : []
            };
            
            console.log('Final Data being sent:', data);
            
            if (editId) {
                await api.put(`/hotels/${editId}`, data);
            } else {
                await api.post('/hotels', data);
            }
            
            setShowModal(false);
            setEditId(null);
            setFormData({ name: '', city: '', address: '', description: '', amenities: '', imageUrl: '' });
            fetchHotels();
        } catch (err) {
            console.error('Launch Error:', err);
            const msg = err.response?.data?.message || 'Server did not respond. Check your image URL length.';
            alert(`Launch Failed: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const [selectedHotelId, setSelectedHotelId] = useState(null);

    const handleManageRooms = (id) => {
        setSelectedHotelId(id);
    };

    if (loading) return <div className="loader-container"><span className="loader"></span></div>;

    if (selectedHotelId) {
        return (
            <div className="manage-rooms-page pb-5">
                <Container className="py-5">
                    <ManageRooms hotelId={selectedHotelId} onBack={() => setSelectedHotelId(null)} />
                </Container>
            </div>
        );
    }

    return (
        <div className="manage-hotels-page pb-5">
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h6 className="text-primary fw-bold text-uppercase ls-1 mb-2">Properties</h6>
                        <h2 className="display-6 fw-800 gradient-text mb-0">Management Portfolio</h2>
                    </div>
                    <Button onClick={() => { setEditId(null); setFormData({name: '', city: '', address: '', description: '', amenities: '', imageUrl: ''}); setShowModal(true); }} className="btn-primary d-flex align-items-center gap-2 px-4 py-2 hover-scale rounded-pill">
                        <Plus size={20} strokeWidth={3} className="text-white" /> Launch New Asset
                    </Button>
                </div>

                <div className="glass-card overflow-hidden shadow-2xl">
                    {hotels.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="bg-white bg-opacity-5 d-inline-block p-4 rounded-circle mb-4 border border-white border-opacity-5">
                                <Hotel size={48} strokeWidth={1} className="text-primary opacity-50" />
                            </div>
                            <h4 className="fw-bold text-white mb-2">Portfolio is currently empty</h4>
                            <p className="text-secondary opacity-75 mb-4 mx-auto" style={{maxWidth: '400px'}}>Add your first luxury hotel by providing the address, description, and high-res imagery.</p>
                            <Button variant="outline-primary" onClick={() => setShowModal(true)} className="rounded-pill px-5 fw-bold btn-sm">
                                Initialize Asset Launch
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover variant="dark" className="m-0 align-middle" style={{ background: 'transparent' }}>
                                <thead className="bg-white bg-opacity-5">
                                    <tr>
                                        <th className="py-4 ps-4 text-secondary small text-uppercase fw-bold ls-2 border-0">Property / Metadata</th>
                                        <th className="py-4 text-secondary small text-uppercase fw-bold ls-2 border-0">Location</th>
                                        <th className="py-4 text-secondary small text-uppercase fw-bold ls-2 border-0 text-center">Status</th>
                                        <th className="py-4 pe-4 text-secondary small text-uppercase fw-bold ls-2 border-0 text-end">Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotels.map(hotel => (
                                        <tr key={hotel._id} className="border-bottom border-white border-opacity-5 transition-all">
                                            <td className="py-4 ps-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-white bg-opacity-5 rounded-3 overflow-hidden border border-white border-opacity-10" style={{ width: '80px', height: '56px' }}>
                                                        {hotel.images?.[0] ? (
                                                            <img src={hotel.images[0]} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                        ) : (
                                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-primary opacity-50">
                                                                <ImageIcon size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold fs-6 text-white mb-1">{hotel.name}</div>
                                                        <div className="text-secondary x-small opacity-50 fw-bold ls-1">ASSET: {hotel._id.slice(-6).toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="d-flex align-items-center gap-2 text-secondary small fw-bold">
                                                    <MapPin size={14} className="text-primary" /> {hotel.city}
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <Badge bg={hotel.isApproved ? 'success' : 'warning'} className="rounded-pill px-3 py-2 small fw-bold bg-opacity-25 text-white border border-white border-opacity-5">
                                                    {hotel.isApproved ? 'Live & Verified' : 'Draft Mode'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 pe-4 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button variant="outline-primary" size="sm" onClick={() => handleManageRooms(hotel._id)} className="fw-bold px-3 py-1 rounded-pill small">Manage Rooms</Button>
                                                    <button onClick={() => handleEdit(hotel)} className="bg-transparent border-0 text-secondary hover-text-primary transition-all p-2"><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(hotel._id)} className="bg-transparent border-0 text-secondary hover-text-danger transition-all p-2"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </Container>

            {/* Premium Add/Edit Hotel Modal */}
            <Modal show={showModal} onHide={() => { if(!submitting) setShowModal(false); setEditId(null); }} centered size="lg" backdrop="static">
                <div className="glass-card" style={{ border: 'none', background: 'var(--bg-main)' }}>
                    <Modal.Header closeButton={!submitting} className="border-0 p-4 pb-0">
                        <div>
                            <Modal.Title className="fw-900 fs-2 gradient-text">{editId ? 'Verify & Update' : 'Initialize Property Launch'}</Modal.Title>
                            <p className="text-secondary small mb-0 mt-2 opacity-75">Deploy your luxury stay to the StaySphere network.</p>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="p-4 px-md-5 pb-5 mt-2">
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-4 mb-5">
                                <Col md={12}>
                                    <Form.Label className="text-secondary x-small fw-bold text-uppercase ls-2 ms-1 mb-2">Property Name</Form.Label>
                                    <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Grand Imperial Pavilion" className="p-3 shadow-none border-white border-opacity-10" />
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="text-secondary x-small fw-bold text-uppercase ls-2 ms-1 mb-2">Location City</Form.Label>
                                    <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="e.g. Udaipur" className="p-3 shadow-none border-white border-opacity-10" />
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="text-secondary x-small fw-bold text-uppercase ls-2 ms-1 mb-2">Asset Image Link</Form.Label>
                                    <Form.Control type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Direct Image URL (e.g. from Unsplash)" className="p-3 shadow-none border-white border-opacity-10" />
                                    <div className="mt-1 text-primary" style={{fontSize: '9px'}}>Note: Use "Copy Image Address" for best results.</div>
                                </Col>
                                <Col md={12}>
                                    <Form.Label className="text-secondary x-small fw-bold text-uppercase ls-2 ms-1 mb-2">Full Physical Address</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="address" value={formData.address} onChange={handleChange} required placeholder="Complete building address..." className="p-3 shadow-none border-white border-opacity-10" />
                                </Col>
                                <Col md={12}>
                                    <Form.Label className="text-secondary x-small fw-bold text-uppercase ls-2 ms-1 mb-2">Strategic Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required placeholder="Craft a story for your guests..." className="p-3 shadow-none border-white border-opacity-10" />
                                </Col>
                                <Col md={12}>
                                    <Form.Label className="text-secondary x-small fw-bold text-uppercase ls-2 ms-1 mb-2">Key Amenities (comma separated)</Form.Label>
                                    <Form.Control type="text" name="amenities" placeholder="Private Spa, In-room Butler, Jet Service" value={formData.amenities} onChange={handleChange} className="p-3 shadow-none border-white border-opacity-10" />
                                </Col>
                            </Row>
                            <Button type="submit" disabled={submitting} className="w-100 p-3 btn-primary fs-5 fw-bold mt-2 shadow-2xl d-flex align-items-center justify-content-center gap-3">
                                {submitting ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    <>
                                        {editId ? <CheckCircle size={20} /> : <Plus size={20} strokeWidth={3} />}
                                        {editId ? 'VALIDATE & DEPLOY CHANGES' : 'INITIALIZE ASSET LAUNCH'}
                                    </>
                                )}
                            </Button>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    );
};

export default ManageHotels;
