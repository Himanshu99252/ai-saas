"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from '@/components/loader';
import { Music } from 'lucide-react';
import { Heading } from '@/components/heading';
import { Empty } from '@/components/ui/empty';

const token = "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";

// Function to query the Hugging Face API
async function query(data: { inputs: string }) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
}

const TextToMusic: React.FC = () => {
    const { control, handleSubmit, formState: { isSubmitting } } = useForm();
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [previousUrl, setPreviousUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const onSubmit = async (data: { prompt: string }) => {
        try {
            const audioBlob = await query({ inputs: data.prompt });
            const url = URL.createObjectURL(audioBlob);
            console.log('Generated audio URL:', url); // Log URL for debugging

            // Revoke the previous URL if it exists
            if (previousUrl) {
                URL.revokeObjectURL(previousUrl);
            }

            setAudioUrl(url);
            setPreviousUrl(url);
        } catch (error) {
            console.error('Error generating music:', error);
        }
    };

    useEffect(() => {
        if (audioUrl && audioRef.current) {
            // Load and play the new audio
            audioRef.current.load();
            audioRef.current.play();
        }
    }, [audioUrl]);

    return (
        <div>
            <Heading
                title="Music Generation"
                description="Turn your prompt into music."
                icon={Music}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />
            <div className="px-4 lg:px-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="
                      rounded-lg 
                      border 
                      w-full 
                      p-4 
                      px-3 
                      md:px-6 
                      focus-within:shadow-sm
                      grid
                      grid-cols-12
                      gap-2
                    "
                >
                    <div className="col-span-12 lg:col-span-10">
                        <Controller
                            name="prompt"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                    placeholder="Piano solo"
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            )}
                        />
                    </div>
                    <Button
                        className="col-span-12 lg:col-span-2 w-full"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Generating...' : 'Generate'}
                    </Button>
                </form>
                {isSubmitting && (
                    <div className="p-20">
                        <Loader />
                    </div>
                )}
                {audioUrl && (
                    <div className="w-full mt-8">
                        <audio ref={audioRef} controls className="w-full" preload="auto">
                            <source src={audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        <a href={audioUrl} download="generated_music.mp3">
                            <Button className="mt-4">Download</Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextToMusic;
