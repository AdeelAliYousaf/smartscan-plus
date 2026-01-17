import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Database configuration
const getDbClient = () => {
  return new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'smartscan_secure_password',
    database: process.env.DB_NAME || 'smartscan_db',
  });
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const client = getDbClient();

    try {
      await client.connect();

      // Find admin by email
      const findAdminQuery = 'SELECT id, name, email, password FROM admin WHERE email = $1';
      const adminResult = await client.query(findAdminQuery, [email]);

      if (adminResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const admin = adminResult.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Update login time
      const updateLoginTimeQuery = 'UPDATE admin SET login_time = CURRENT_TIMESTAMP WHERE id = $1';
      await client.query(updateLoginTimeQuery, [admin.id]);

      // Generate JWT token
      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: 'admin'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Create response
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        }
      });

      // Set HTTP-only cookie with the token
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      });

      return response;

    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
