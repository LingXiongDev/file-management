// app/api/proxy/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { dev_name, file_path, file_name } = body;

    const response = await axios.put(`https://yes.bobjoy.com/fs/rename/${dev_name}/${file_path}/${file_name}`);
    return NextResponse.json(response.data);
  } catch (error) {

    return NextResponse.json({ error: error.message }, { status: error.response ? error.response.status : 500 });
  }
}
