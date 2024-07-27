"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from '@/components/loader';
import { Card, CardFooter } from "@/components/ui/card";
import { ImageIcon } from 'lucide-react';
import { Heading } from '@/components/heading';

// Define a type for error messages
type ErrorType = string | null;

const sizes = [
  { value: '256x256', label: '256x256' },
  { value: '512x512', label: '512x512' },
  { value: '1024x1024', label: '1024x1024' },
];

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorType>(null);
  const [size, setSize] = useState<string>('512x512'); // Default size

  const token = process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN as string; 

  const query = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Melonie/text_to_image_finetuned",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt, size }), // Include size in the request
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await response.blob();
      const objectURL = URL.createObjectURL(result);
      setImageSrc(objectURL);

    } catch (error) {
      setError('Error fetching the image.');
      console.error("Error fetching the image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Split the size value to get width and height
  const [width, height] = size.split('x').map(Number);

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              query();
            }}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <div className="col-span-12 lg:col-span-6">
              <Input
                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A picture of a horse in Swiss alps"
                disabled={isLoading}
              />
            </div>
            <div className="col-span-12 lg:col-span-2">
              <select
                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent w-full"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                disabled={isLoading}
              >
                {sizes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Image'}
            </Button>
          </form>
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {imageSrc && (
            <div className="grid grid-cols-1 gap-4 mt-8">
              <Card className="rounded-lg overflow-hidden">
                <div
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    position: 'relative',
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Generated"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(imageSrc)}
                    variant="secondary"
                    className="w-full"
                  >
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
