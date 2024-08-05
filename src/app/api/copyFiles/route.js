// app/api/proxy/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request) {
  try {
    const body = await request.json();
    console.log(11, body);
    const response = await axios.put(`https://yes.bobjoy.com/fs/copy`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: error.response ? error.response.status : 500 });
  }
}
