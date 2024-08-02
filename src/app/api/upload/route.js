import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const field = formData.get("field");
    const dev_name = formData.get("dev_name");
    const file_path = formData.get("file_path");

    const uploadFormData = new FormData();
    uploadFormData.append("field", field);
    uploadFormData.append("dev_name", dev_name);
    uploadFormData.append("file_path", file_path);

    const response = await axios.post(
      "http://yes.bobjoy.com/fs/upload",
      uploadFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.response ? error.response.status : 500 }
    );
  }
}
