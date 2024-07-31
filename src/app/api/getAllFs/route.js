// app/api/proxy/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams(searchParams);

  try {
    const response = await axios.get(`https://yes.bobjoy.com/fs/all/${params.get("dev_name")}/${params.get("file_path")}`);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.response ? error.response.status : 500 });
  }
}
