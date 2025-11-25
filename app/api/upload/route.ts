import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          resolve(NextResponse.json({ error: error.message }, { status: 500 }));
        } else if (result && result.secure_url) {
          resolve(NextResponse.json({ url: result.secure_url }));
        } else {
          resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
        }
      }
    );
    uploadStream.end(buffer);
  });
}
