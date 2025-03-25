import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

//const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_API_KEY ?? "";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });
  try {
    // Return the responses from all batch queries
    const formData = await req.formData();
    // Get images (returns an array if multiple images were uploaded)
    const images = formData.getAll("images");

    // Get the prompt field
    const prompt = formData.get("prompt") as string;
    const imageFiles: File[] = [];

    // Extract images from FormData
    images.forEach((value) => {
      if (value instanceof File) {
        console.log(`Processing file: ${value.name} (${value.type})`);
        imageFiles.push(value);
      }
    });

    if (imageFiles.length === 0) {
      console.error("No images found in FormData");
      return NextResponse.json({ error: "No images uploaded" }, { status: 400 });
    }

    // Convert each image to ArrayBuffer
    const imageBuffers = await Promise.all(
      imageFiles.map(async (imageFile) => {
        const arrayBuffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");
        return {
          base64: base64Image,
          mimeType: imageFile.type,
        };
      })
    );
  
   // Generate captions for each image
   const results = await Promise.all(
    imageBuffers.map(async (image) => {
      try {
        const result = await model.generateContent([
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          prompt,
        ]);

        return {
          success: true,
          caption: result.response.text(),
        };
      } catch (error) {
        console.error("Error generating text for image:", error);
        return { success: false, error: "Failed to generate caption" };
      }
    })
  );

  return NextResponse.json({ results });
  } catch (error) {
    console.log("Error generating text for image:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  } 
}
