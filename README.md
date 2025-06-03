# Freelance Project Management Platform

![image](https://github.com/user-attachments/assets/b7852885-3819-4b5e-b67c-42367bd1434b)



A modern, full-stack application for connecting clients and freelancers, managing projects, bids, payments, and communications.

## Features

- **User Authentication**: Secure login and registration with role-based access (Client/Freelancer)
- **Project Management**: Create, view, and manage projects with detailed descriptions and requirements
- **Bidding System**: Freelancers can bid on projects, clients can review and accept bids
- **Real-time Chat**: Instant messaging between clients and freelancers with a modern, WeTransfer-inspired UI
- **Payment Processing**: Integrated payment system for project milestones and completions
- **Role-Based Access Control**: Different views and permissions for clients and freelancers
- **Responsive Design**: Clean, minimalist interface that works on all devices

## Tech Stack

### Frontend
- React.js with hooks for state management
- Redux Toolkit for global state
- Material-UI (MUI) for component styling
- Socket.io client for real-time chat
- Formik & Yup for form validation
- React Router for navigation
- date-fns for date formatting

### Backend
- Node.js with Express
- MongoDB for database
- Mongoose for object modeling
- JWT for authentication
- Socket.io for real-time communication
- Stripe integration for payments

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mernstack3
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
```

5. Start the backend server
```bash
npm start
```

6. Start the frontend development server
```bash
cd ../frontend
npm start
```

7. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
mernstack3/
├── backend/             # Node.js backend
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
│
├── frontend/            # React frontend
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── features/    # Redux slices and logic
│       ├── pages/       # Page components
│       ├── utils/       # Utility functions
│       ├── App.js       # Main app component
│       └── index.js     # Entry point
│
└── README.md            # Project documentation
```

## Key Components

### Authentication
- JWT-based authentication with secure token storage
- Protected routes for authenticated users
- Role-based access control (Client/Freelancer)

### Project Management
- Create projects with detailed descriptions, budgets, and requirements
- Browse available projects with filtering options
- View project details and submitted bids

### Bidding System
- Submit bids with proposals and pricing
- Review and accept bids
- Notifications for bid status changes

### Chat System
- Real-time messaging between clients and freelancers
- Message history and conversation management
- File attachment support

### Payment Processing
- Secure payment processing with Stripe
- Payment status tracking
- Invoice generation

## UI Design

The application follows a clean, minimalist design inspired by WeTransfer with:
- Primary blue accent color (#3840DE)
- Clean white and light backgrounds (#FFFFFF, #FAFAFA)
- Rounded corners for softness
- Minimal clutter with clear hierarchy and spacing
- Smooth transitions and subtle shadows
- Responsive layout for all device sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- Socket.io for real-time communication capabilities
- MongoDB Atlas for database hosting
- Stripe for payment processing
