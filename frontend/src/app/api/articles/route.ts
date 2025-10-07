import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://web:8000';

export async function GET(request: NextRequest) {
  try {
    // Forward cookies and headers from the original request
    const cookies = request.headers.get('cookie');
    
    const headers: any = {};
    
    if (cookies) {
      headers['Cookie'] = cookies;
    }
    
    const response = await axios.get(`${BACKEND_URL}/api/articles/`, {
      headers,
      withCredentials: true,
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    
    if (error.response) {
      return NextResponse.json(
        error.response.data || { error: 'Failed to fetch articles' }, 
        { status: error.response.status }
      );
    }
    
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward cookies and headers from the original request
    const cookies = request.headers.get('cookie');
    const csrfToken = request.headers.get('x-csrftoken');
    
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (cookies) {
      headers['Cookie'] = cookies;
    }
    
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
    
    const response = await axios.post(`${BACKEND_URL}/api/articles/`, body, {
      headers,
      withCredentials: true,
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating article:', error);
    
    // Forward the actual error from the backend
    if (error.response) {
      return NextResponse.json(
        error.response.data || { error: 'Failed to create article' }, 
        { status: error.response.status }
      );
    }
    
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}