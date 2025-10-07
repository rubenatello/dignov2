import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://web:8000';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const response = await axios.put(`${BACKEND_URL}/api/articles/${params.id}/`, body, {
      headers,
      withCredentials: true,
    });
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating article:', error);
    
    if (error.response) {
      return NextResponse.json(
        error.response.data || { error: 'Failed to update article' }, 
        { status: error.response.status }
      );
    }
    
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Forward cookies and headers from the original request
    const cookies = request.headers.get('cookie');
    const csrfToken = request.headers.get('x-csrftoken');
    
    const headers: any = {};
    
    if (cookies) {
      headers['Cookie'] = cookies;
    }
    
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
    
    await axios.delete(`${BACKEND_URL}/api/articles/${params.id}/`, {
      headers,
      withCredentials: true,
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    
    if (error.response) {
      return NextResponse.json(
        error.response.data || { error: 'Failed to delete article' }, 
        { status: error.response.status }
      );
    }
    
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}