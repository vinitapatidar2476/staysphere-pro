require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');

const hotelsToSeed = [
    {
        name: "Aman-i-Khas",
        city: "Ranthambore",
        address: "Ranthambore National Park, Sawai Madhopur, Rajasthan",
        description: "A luxury safari tented camp on the edge of Ranthambore National Park. Experience the wild in unprecedented comfort.",
        images: ["https://images.unsplash.com/photo-1549388655-6673771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["WiFi", "Swimming Pool", "Private Safari", "Organic Dining", "Luxury Spa", "Evening Campfires"],
        isApproved: true,
        avgRating: 4.8,
        minPrice: 4500
    },
    {
        name: "The Oberoi Amarvilas",
        city: "Agra",
        address: "Taj East Gate Road, Agra, Uttar Pradesh",
        description: "Luxury hotel offering uninterrupted views of the Taj Mahal from every room. A true architectural marvel.",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["WiFi", "Gym", "Taj View Deck", "Royal Spa", "Butler Service", "Gourmet Kitchen"],
        isApproved: true,
        avgRating: 4.9,
        minPrice: 8500
    },
    {
        name: "Taj Lake Palace",
        city: "Udaipur",
        address: "Pichola, Udaipur, Rajasthan",
        description: "A marble palace appearing to float on the calm waters of Lake Pichola. Iconic and breathtaking.",
        images: ["https://images.unsplash.com/photo-1549388658-052447999450?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["WiFi", "Bar", "Lake Cruises", "Vintage Escort", "Royal Welcome", "Floating Spa"],
        isApproved: true,
        avgRating: 4.7,
        minPrice: 12000
    },
    {
        name: "Wildflower Hall",
        city: "Shimla",
        address: "Chharabra, Shimla, Himachal Pradesh",
        description: "An Oberoi Resort located in the Himalayas, surrounded by cedar forests. Peace and tranquility above the clouds.",
        images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["WiFi", "Parking", "Mountain Trekking", "Heated Pool", "Library Bar", "Yoga Pavilion"],
        isApproved: true,
        avgRating: 4.6,
        minPrice: 6500
    },
    {
        name: "Indore Royal Heritage",
        city: "Indore",
        address: "Rajwada Palace area, Indore, MP",
        description: "Experience the royal Malwa hospitality in the heart of Indore. Luxury reimagined for the modern traveler.",
        images: ["https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["WiFi", "Restaurant", "Heritage Tour", "Malwa Cuisine", "Premium Spa", "Business Center"],
        isApproved: true,
        avgRating: 4.2,
        minPrice: 3500
    },
    {
        name: "The Blue City Retreat",
        city: "Jodhpur",
        address: "Fort Road, Jodhpur, Rajasthan",
        description: "A boutique hotel nestled in the blue city with breathtaking views of Mehrangarh Fort.",
        images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["WiFi", "Spa", "Fort View", "Rooftop Dining", "Cultural Shows", "Desert Safari"],
        isApproved: true,
        avgRating: 4.5,
        minPrice: 5500
    }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected. Re-seeding with unique luxury images...');
    const user = await User.findOne({ email: 'admin@stayease.com' });
    if (!user) {
        console.error('Admin user not found. Please run seed.js first.');
        process.exit(1);
    }

    await Hotel.deleteMany({});
    await Room.deleteMany({});
    console.log('Existing data cleared.');

    for (const hData of hotelsToSeed) {
        const hotel = new Hotel({
            ...hData,
            managerId: user._id
        });
        await hotel.save();
        console.log(`Hotel created: ${hotel.name}`);

        const rooms = [
            { hotelId: hotel._id, type: 'Deluxe Room', price: 4500, capacity: 2, totalRooms: 10, availableRooms: 10 },
            { hotelId: hotel._id, type: 'Executive Suite', price: 8500, capacity: 3, totalRooms: 5, availableRooms: 5 },
            { hotelId: hotel._id, type: 'Presidential Villa', price: 15000, capacity: 4, totalRooms: 2, availableRooms: 2 }
        ];
        await Room.insertMany(rooms);
    }

    console.log('Seeding completed successfully!');
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
