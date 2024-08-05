// app/api/proxy/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dev_name = searchParams.get("dev_name");
  const file_path = searchParams.get("file_path");

  try {
    const response = await axios.get(
      `https://yes.bobjoy.com/fs/download/${dev_name}/${file_path}`,
      {
        responseType: "arraybuffer",
      }
    );

    // 获取文件名
    const fileName = file_path.split("/").pop();

    return new Response(response.data, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response ? error.response.status : 500 }
    );
  }
}
