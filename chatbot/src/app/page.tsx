'use client'
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputComponent from "./InputComponent";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function Home() {

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [response, setResponse] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (!event.target.files) return; // ✅ Prevents null error
    const imgFiles = Array.from(event.target.files)
    if (imgFiles.length > 4 || imgFiles.length + files.length > 4) {
        alert("Limit 4 images");
        return;
    } else {
        setFiles((prevFiles) => [...prevFiles, ...imgFiles]);
    }
  };

  useEffect(() => {
    console.log("test");
    console.log(files);
    
    setPreview(files.map((item) => {
      return (URL.createObjectURL(item));
    }))
  }, [files])


  return (
    <div className="p-10 flex flex-col items-center h-auto min-h-screen">
      <div className="w-9/12 h-full gap-5 flex flex-grow flex-col justify-between">
        <header className="flex flex-col gap-5 items-center">
          <h1 className="text-4xl font-bold w-full text-center">AI Image Analysis</h1>
          <Card className="p-5 text-xl border-none shadow-none bg-[#F1F5F9] text-[#788599] w-full">
            <h2>Welcome to the AI Image Analysis Chatbot! Upload up to 4 images and ask a question to analyze each image.</h2>
          </Card>
          {preview.length == 0 &&
          <Button className="cursor-pointer" onClick={handleClick}>
                <span>Upload images</span>
                <Plus />
                <Input         
                ref={fileInputRef}
                className="hidden"
                id="picture"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                multiple />
          </Button>
          }
        </header>
        <input className="hidden" id="picture" type="file" accept="image/png, image/jpeg" multiple/>
        <section className="flex w-full justify-center gap-3">
          {loading && <div>loading...</div>}
          {files.map((file, index) => (
              <Card key={index} className="w-full max-w-1/4 max-h-96 hover:scale-125 transition-all duration-200">
                {preview[index] ? (
                  <Image
                    src={preview[index]}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                    alt={`Uploaded image #${index}`}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex justify-center items-center text-gray-500">
                    No Image Preview
                  </div>
                )}
              </Card> // ✅ Now correctly mapping over an array
            ))}
        </section>
        <section className="w-full h-10">
          <div className="w-9/12 absolute left-1/2 bottom-10 transform -translate-x-1/2">
            <InputComponent setFiles={setFiles} files={files} setLoading={setLoading} loading={loading}/>
          </div>
        </section>
        </div>
    </div>
  );
}
