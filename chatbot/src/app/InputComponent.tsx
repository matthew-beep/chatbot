'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Send } from "lucide-react";
import { useRef, useState } from "react";

interface InputComponentProps {
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    files: File[],
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean,
    setMessages: React.Dispatch<React.SetStateAction<
    ({ role: "user"; text: string } | { role: "bot"; text: { caption: string }[] })[]
  >>;
  }
const InputComponent: React.FC<InputComponentProps> = ({ setFiles, files, setLoading, loading, setMessages }) => {

    const [input, setInput] = useState<string>("");

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
            setFiles((prevFiles) => [...prevFiles, ...imgFiles]); // ✅ Updates state
        }
    };

    const handleSubmit = async () => {
        if (!loading && (input.length > 0 && files.length > 0)) {
            setMessages((prev) => [
                ...prev,
                { role: "user", text: input } // Add user message to the array
              ]);

            setLoading(true);
            try {
                const formData = new FormData();
                files.forEach(file => {
                    formData.append("images", file);  // Appends each image file
                });
                formData.append("prompt", input);
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    body: formData, // Send form data with image files
                });
            
                const data = await res.json();
                console.log(data); // Handle the response
                setMessages((prev) => [
                    ...prev,
                    {
                      role: "bot",
                      text: data.results.map((res: { caption: string }) => ({ caption: res.caption }))
                    }
                  ]);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
                setInput(""); // Clear input field after submission
            }
        }

        if (input.length == 0 || files.length == 0) {
            alert("Please enter a prompt and select at least one image");
            return;
        }
    };

    return (
        <div className="flex w-full gap-3">
            <Button className="cursor-pointer" onClick={handleClick}>
                <Plus />
                <input         
                ref={fileInputRef}
                className="hidden"
                id="picture"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                multiple />
            </Button>
            <Input type="text" className="bg-white" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Prompt..."></Input>
            <Button className="cursor-pointer" onClick={handleSubmit}><Send /></Button>
        </div>
    );
}

export default InputComponent;