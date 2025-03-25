'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import InputComponent from "./InputComponent";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Images} from "lucide-react";

export default function Home() {

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [messages, setMessages] = useState<
  ({ role: "user"; text: string } | { role: "bot"; text: { caption: string }[] })[]
>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    console.log("click"); 
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
          <Card className="p-5 text-xl border-none shadow-none bg-[#F1F5F9] text-[#788599] w-auto">
            <h2>Welcome to the AI Image Analysis Chatbot! Upload up to 4 images and ask a question to analyze each image.</h2>
          </Card>
        </header>
        <input className="hidden" id="picture" type="file" accept="image/png, image/jpeg" multiple/>
        <section className="flex w-full justify-center gap-3">
            <div className="w-[35%] h-1/3">
              <Card className="w-full h-full flex flex-col justify-between">
                <CardHeader className="h-auto p-0">
                  <h3 className="text-2xl font-bold text-center">Images</h3>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 w-full h-full">
                  {preview.slice(0, 4).map((image, index) => (
                    <Card key={index} className="w-full h-full hover:scale-110 transition-all duration-200">
                      {image ? (
                        <Image
                          src={image}
                          width={300}
                          height={300}
                          className="w-full h-full object-contain"
                          alt={`Uploaded image #${index}`}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex justify-center items-center text-gray-500">
                          <Images />
                        </div>
                      )}
                    </Card>
                  ))}
                </CardContent>

                <CardFooter className="flex justify-center items-center">
                  <Button className="cursor-pointer w-full" onClick={handleClick}>
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
                </CardFooter>
              </Card>
            </div>
        </section>
        <section className="w-full h-auto pb-24 flex flex-col ">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded-md flex ${
                message.role === "user"
                  ? "bg-blue-500 text-white self-end ml-auto text-right max-w-max"
                  : "bg-gray-300 text-black self-start text-left  w-auto"
              }`}
            >
              {message.role === "user" ? (
                <p>{message.text}</p> // ✅ Directly display text for user
              ) : (
                <ul className="flex md:flex-row flex-col gap-3 h-auto  justify-between">
                  {message.text.map((item, idx) => ( // ✅ Map only if it's a bot message
                    <li className="xl:w-80 lg:w-40 md:w-32 h-auto" key={idx}> {/* Apply max-w-max here */}
                      <Card className="p-0 flex flex-col gap-0 w-full hover:scale-120 transition-all duration-200">
                        <CardHeader className="h-full p-0">
                          <Image
                            src={preview[idx]}
                            width={300}
                            height={300}
                            className="w-full h-full object-contain"
                            alt={`Uploaded image #${index}`}
                          />
                        </CardHeader>
                        <CardContent className="h-auto">
                          <p className="font-light">{item.caption ? item.caption : "No text generated"}</p>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-300 self-start text-left max-w-max w-auto rounded-full px-3 py-4 h-auto flex gap-3">
              <Skeleton className="bg-[#202020] w-3 h-3 rounded-full"/>
              <Skeleton className="bg-[#202020] w-3 h-3 rounded-full"/>
              <Skeleton className="bg-[#202020] w-3 h-3 rounded-full"/>
            </div>
          )}
        </section>
        <section className="w-full h-20 fixed bottom-0 left-0 flex items-center justify-center bg-gradient-to-t from-white to-transparent">
          <div className="w-9/12">
            <InputComponent setFiles={setFiles} files={files} setLoading={setLoading} loading={loading} setMessages={setMessages}/>
          </div>
        </section>

        </div>
    </div>
  );
}
