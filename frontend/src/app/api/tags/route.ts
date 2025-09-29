import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://web:8000';

// GET /api/tags/suggest?q=term
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  try {
    const response = await axios.get(`${BACKEND_URL}/api/tags/suggest/`, { params: { q } });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching tag suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch tag suggestions' }, { status: 500 });
  }
}
