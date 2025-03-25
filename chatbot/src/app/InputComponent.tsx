'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Send } from "lucide-react";
import { useRef } from "react";

interface InputComponentProps {
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    files: File[]
  }
const InputComponent: React.FC<InputComponentProps> = ({ setFiles, files }) => {

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

    return (
        <div className="flex w-full gap-3">
            <Button className="cursor-pointer" onClick={handleClick}>
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
            <Input type="text" placeholder="Enter Prompt..."></Input>
            <Button className="cursor-pointer"><Send /></Button>
        </div>
    );
}

export default InputComponent;