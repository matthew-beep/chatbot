'use client'
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import InputComponent from "./InputComponent";
import { useState, useEffect } from "react";
export default function Home() {

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    console.log("test");
    console.log(files);
  }, [files])

  return (
    <div className="p-10 flex flex-col items-center h-auto min-h-screen border-2 border-amber-400">
      <div className="w-6/12 h-full gap-5 flex flex-grow flex-col justify-between">
        <header className="flex flex-col gap-5 items-center">
          <h1 className="text-4xl font-bold w-full text-center">AI Image Analysis</h1>
          <Card className="p-5 text-xl border-none shadow-none bg-[#F1F5F9] text-[#788599] w-full">
            <h2>Welcome to the AI Image Analysis Chatbot! Upload up to 4 images and ask a question to analyze each image.</h2>
          </Card>
        </header>
        <Input className="hidden" id="picture" type="file" accept="image/png, image/jpeg" multiple></Input>
        <section>
        {files.map((file, index) => (
            <p key={index}>{file.name}</p> // ✅ Now correctly mapping over an array
          ))}
        </section>
        <InputComponent setFiles={setFiles}/>
        </div>
    </div>
  );
}
