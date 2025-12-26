# Inventory Management System

A full-stack inventory management system built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 User authentication (Admin & Staff roles)
- 📦 Product management (CRUD operations)
- 💰 Sales tracking
- 🧾 Billing system with invoice generation
- 📊 Dashboard with analytics
- 📱 Responsive design

## Tech Stack

**Frontend:**
- React 19
- React Router
- Axios
- Chart.js
- TailwindCSS
- Vite

**Backend:**
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tharun-Kumar-228/Inventory-Management-System.git
   cd inventory-system
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Seed the database (optional)**
   ```bash
   cd backend
   node seeder.js
   ```
   
   This creates default users:
   - Admin: admin@example.com / password123
   - Staff: staff@example.com / password123

5. **Run the development server**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Production Deployment (Render)

### Deploy to Render

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

3. **Set Environment Variables in Render Dashboard**
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production
   - `PORT`: 5000 (or leave default)

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application
   - The build process is defined in `render.yaml` to prevent recursive builds

### Manual Deployment (Alternative)

If not using `render.yaml`, configure manually:

**Build Command:**
```bash
cd backend && npm install --prefer-offline --no-audit && cd ../frontend && npm install --prefer-offline --no-audit && npm run build
```

**Start Command:**
```bash
npm start
```

### Post-Deployment

After deployment, seed the database:
```bash
# SSH into your Render instance or use Render Shell
node backend/seeder.js
```

## Project Structure

```
inventory-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── .env            # Environment variables
│   ├── server.js       # Express server
│   └── seeder.js       # Database seeder
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   ├── dist/           # Production build
│   └── vite.config.js  # Vite configuration
├── .gitignore
├── render.yaml         # Render deployment config
└── package.json        # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale

### Bills
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create bill
- `GET /api/bills/:id` - Get bill by ID

## Troubleshooting

### Recursive Build on Render
If you encounter recursive builds:
- Ensure `render.yaml` is in the root directory
- Check that `.gitignore` excludes `node_modules` and `dist`
- Verify build command doesn't trigger nested npm installs

### MongoDB Connection Issues
- Verify `MONGO_URI` is correct in environment variables
- Ensure MongoDB Atlas allows connections from Render's IP (0.0.0.0/0)
- Check network access settings in MongoDB Atlas

### Frontend Not Loading
- Ensure frontend build completed successfully
- Check that `frontend/dist` directory exists
- Verify Express is serving static files correctly

## License

ISC

## Author

TharunKumar M
