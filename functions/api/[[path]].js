import { Router } from 'itty-router';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Create a new router
const router = Router();

// MongoDB connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://BlueRock:bluerock2025@cluster0.bbhiwso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
};

// Import models
import '../../../src/models/User.js';
import '../../../src/models/Client.js';
import '../../../src/models/Investment.js';
import '../../../src/models/Transaction.js';
import '../../../src/models/Withdrawal.js';
import '../../../src/models/OTP.js';
import '../../../src/models/Notification.js';

// Import controllers
import * as authController from '../../../src/controllers/auth.controller.js';
import * as userController from '../../../src/controllers/user.controller.js';
import * as clientController from '../../../src/controllers/client.controller.js';
import * as investmentController from '../../../src/controllers/investment.controller.js';
import * as transactionController from '../../../src/controllers/transaction.controller.js';
import * as withdrawalController from '../../../src/controllers/withdrawal.controller.js';
import * as otpController from '../../../src/controllers/otp.controller.js';
import * as notificationController from '../../../src/controllers/notification.controller.js';

// Middleware to verify JWT token
const protect = async (request) => {
  try {
    let token;
    
    if (request.headers.get('Authorization') && 
        request.headers.get('Authorization').startsWith('Bearer')) {
      token = request.headers.get('Authorization').split(' ')[1];
    }
    
    if (!token) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Not authorized to access this route' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bluerock_secure_jwt_key_for_production_2025');
    
    const User = mongoose.model('User');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'User not found' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Add user to request
    request.user = user;
    return request;
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Not authorized to access this route' 
    }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests for CORS
router.options('*', () => {
  return new Response(null, {
    headers: corsHeaders
  });
});

// Auth routes
router.post('/auth/register', async (request) => {
  await connectDB();
  const data = await request.json();
  try {
    const result = await authController.register(data);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || 'Registration failed' 
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

router.post('/auth/login', async (request) => {
  await connectDB();
  const data = await request.json();
  try {
    const result = await authController.login(data);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || 'Login failed' 
    }), { 
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

router.post('/auth/forgot-password', async (request) => {
  await connectDB();
  const data = await request.json();
  try {
    const result = await authController.forgotPassword(data);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || 'Password reset failed' 
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

router.post('/auth/reset-password', async (request) => {
  await connectDB();
  const data = await request.json();
  try {
    const result = await authController.resetPassword(data);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || 'Password reset failed' 
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// User routes
router.get('/users/me', async (request) => {
  await connectDB();
  const authRequest = await protect(request);
  
  if (authRequest instanceof Response) {
    return authRequest;
  }
  
  try {
    const result = await userController.getMe(authRequest);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || 'Failed to get user profile' 
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

router.put('/users/update-profile', async (request) => {
  await connectDB();
  const authRequest = await protect(request);
  
  if (authRequest instanceof Response) {
    return authRequest;
  }
  
  const data = await request.json();
  try {
    const result = await userController.updateProfile(authRequest, data);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || 'Failed to update profile' 
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

router.put('/users/change-password', async (request) => {
  await connectDB();
  const authRequest = await protect(request);
  
  if (authRequest instanceof Response) {
    return authRequest;
  }
  
  const data = await request.json();
  try {
    const result = await userController.changePassword(authRequest, data);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || 'Failed to change password' 
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Add similar routes for other controllers (clients, investments, transactions, withdrawals, etc.)
// For brevity, I'm not including all routes here, but you would follow the same pattern

// Catch-all route for 404
router.all('*', () => {
  return new Response(JSON.stringify({ 
    success: false, 
    message: 'Route not found' 
  }), { 
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});

// Export the handler function
export default {
  async fetch(request, env, ctx) {
    // Set environment variables from env
    process.env = { ...process.env, ...env };
    
    // Handle the request with the router
    return router.handle(request);
  }
};