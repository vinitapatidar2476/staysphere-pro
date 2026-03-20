# Hotel Booking & Management Platform

## Architecture & Technology Stack
- **Frontend**: React + React Bootstrap + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Payments**: Razorpay (Test Mode)
- **External API**: Google Maps (Location display)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Razorpay Account (Test Mode)
- Google Maps API Key

### Backend Setup
1. Open terminal and navigate to the \`backend\` folder: \`cd backend\`
2. Create a \`.env\` file in the \`backend\` root directory with the following variables:
   \`\`\`env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   \`\`\`
3. Install dependencies: \`npm install\`
4. Start the server: \`npm run dev\`

### Frontend Setup
1. Open a new terminal and navigate to the \`frontend\` folder: \`cd frontend\`
2. Create a \`.env\` file in the \`frontend\` root directory with the following variables:
   \`\`\`env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   \`\`\`
3. Install dependencies: \`npm install\`
4. Start the app: \`npm run dev\`

### Demo Notes
- Create an Admin account manually or via seed script (if provided).
- Admin can then approve new hotels registered by "Hotel Manager" roles.
- Customers can search for hotels, view details with Google Maps, and book using Razorpay.
