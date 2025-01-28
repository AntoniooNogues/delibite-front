import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Buffer } from "buffer";

export const POST = async (req: Request) => {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
        const uploadResponse = await cloudinary.uploader.upload(base64String, {
            resource_type: "auto",
            folder: "Delibite",
        });
        return NextResponse.json({ url: uploadResponse.secure_url });

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
};