// pages/api/image.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// Use environment variables for tokens to secure them
const token = process.env.HUGGINGFACE_TOKEN; // Make sure to set this in your .env.local

// Define the structure of the request body
interface ImageGenerationRequest {
  prompt: string;
  amount: string;
  resolution: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { prompt, amount, resolution }: ImageGenerationRequest = req.body;

      // Validate the request data if necessary

      // Call the Hugging Face API to generate images
      const response = await fetch("https://api-inference.huggingface.co/models/Melonie/text_to_image_finetuned", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
      
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      // Convert response to Blob and then to URL
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Respond with the image URL
      res.status(200).json([{ url: imageUrl }]); // Adjust according to your needs

    } catch (error) {
      console.error('Error generating image:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
