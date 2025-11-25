import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise<NextResponse>((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error: any, result: any) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error("Cloudinary upload error:", error);
          resolve(NextResponse.json({ error: error.message || "Upload error" }, { status: 500 }));
          return;
        }

        if (result && result.secure_url) {
          resolve(NextResponse.json({ url: result.secure_url }));
        } else {
          resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
        }
      }
    );

    uploadStream.end(buffer);
  });
}
