import { NextRequest, NextResponse } from 'next/server';
import { editImage } from '@/lib/gemini';

// Enable Edge runtime for improved performance
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt, imageData, mimeType } = body;
    
    // Validate the request parameters
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A valid prompt is required' },
        { status: 400 }
      );
    }

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json(
        { error: 'Valid image data is required' },
        { status: 400 }
      );
    }

    // Call the Gemini API to edit the image
    const result = await editImage(
      prompt,
      imageData,
      mimeType || 'image/png'
    );

    // If no image was generated
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to edit image' },
        { status: 500 }
      );
    }

    // Return the edited image data
    return NextResponse.json({
      success: true,
      image: {
        data: result.imageData,
        mimeType: result.mimeType,
        text: result.text,
      },
    });
  } catch (error: any) {
    console.error('Error in edit-image API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}