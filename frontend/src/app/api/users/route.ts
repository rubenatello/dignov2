import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://web:8000';

export async function GET() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return mock data for development
    return NextResponse.json([
      { id: 1, first_name: "John", last_name: "Doe", email: "john@dignov2.com" },
      { id: 2, first_name: "Jane", last_name: "Smith", email: "jane@dignov2.com" }
    ]);
  }
}