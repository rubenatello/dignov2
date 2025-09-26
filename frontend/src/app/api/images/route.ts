import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://web:8000';

export async function GET() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/images/`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post(`${BACKEND_URL}/api/images/`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 });
  }
}