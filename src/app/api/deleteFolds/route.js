// app/api/proxy/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await axios.delete(`https://yes.bobjoy.com/fs/delete`, { data: body });
    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: error.response ? error.response.status : 500 });
  }
}
