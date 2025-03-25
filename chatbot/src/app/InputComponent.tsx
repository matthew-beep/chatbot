'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRef } from "react";

interface InputComponentProps {
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
  }
const InputComponent: React.FC<InputComponentProps> = ({ setFiles }) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files);
        if (!event.target.files) return; // ✅ Prevents null error
        setFiles(Array.from(event.target.files)); // ✅ Updates state
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

            <Input></Input>
            <Button></Button>
        </div>
    );
}

export default InputComponent;