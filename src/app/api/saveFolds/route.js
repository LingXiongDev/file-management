// app/api/proxy/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { dev_name, file_path } = body;

    const response = await axios.post(`https://yes.bobjoy.com/fs/create_dir/${dev_name}/${file_path}`);
    return NextResponse.json(response.data);
  } catch (error) {

    return NextResponse.json({ error: error.message }, { status: error.response ? error.response.status : 500 });
  }
}
