import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/gemini';

// Enable Edge runtime for improved performance
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt, responseModalities } = body;
    
    // Validate the prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A valid prompt is required' },
        { status: 400 }
      );
    }

    // Call the Gemini API to generate the image
    const result = await generateImage({
      prompt,
      responseModalities: responseModalities || ['Text', 'Image'],
    });

    // If no image was generated
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    // Return the generated image data
    return NextResponse.json({
      success: true,
      image: {
        data: result.imageData,
        mimeType: result.mimeType,
        text: result.text,
      },
    });
  } catch (error: any) {
    console.error('Error in generate-image API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}