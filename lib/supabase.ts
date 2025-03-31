import { createClient } from '@supabase/supabase-js';
import { base64ToBlob } from './utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Sign up with email and password
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Get user's generation count from the generated_images table
export async function getUserGenerationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('generated_images')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count || 0;
}

// Save a generated image to the user's history
export async function saveGeneratedImage(
  imageUrl: string,
  prompt: string,
  userId: string
) {
  try {
    console.log("Starting image save process for user:", userId);
    
    // Check for active session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session error:", sessionError);
      throw new Error(`No active session: ${sessionError.message}`);
    }
    if (!session) {
      console.error("No session available");
      throw new Error('No active session. Please sign in again.');
    }

    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    console.log("Processing image data format");
    // Handle both data URL format and regular base64 string
    let base64Data, mimeType;
    
    if (imageUrl.includes(',')) {
      // Data URL format: "data:image/png;base64,iVBORw0KGgo..."
      const [header, base64] = imageUrl.split(',');
      base64Data = base64;
      mimeType = header.split(':')[1]?.split(';')[0];
      console.log("Data URL format detected, mime type:", mimeType);
    } else {
      // Direct base64 format from Gemini API response
      base64Data = imageUrl;
      mimeType = 'image/png'; // Default to PNG if not specified
      console.log("Direct base64 format detected");
    }
    
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }
    
    try {
      console.log("Creating blob from base64 data");
      const blob = await base64ToBlob(base64Data, mimeType);
      
      // Create a File object from the blob
      const fileName = `${userId}-${Date.now()}.${mimeType.split('/')[1] || 'png'}`;
      console.log("Creating file object with name:", fileName);
      const file = new File([blob], fileName, { type: mimeType });
      
      console.log(`Starting upload to storage bucket 'images'`);
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`${userId}/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Storage upload error:", JSON.stringify(uploadError));
        throw uploadError;
      }
      
      console.log("Upload successful, getting public URL");
      // Get the public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(`${userId}/${fileName}`);

      if (!urlData || !urlData.publicUrl) {
        console.error("Failed to get public URL, data:", urlData);
        throw new Error('Failed to get public URL for uploaded image');
      }
      
      console.log("Public URL obtained:", urlData.publicUrl);
      console.log("Saving record to database");
      // Save the record to the database
      const { data, error } = await supabase.from('generated_images').insert([
        {
          user_id: userId,
          prompt,
          image_url: urlData.publicUrl,
        },
      ]);

      if (error) {
        console.error("Database insert error:", JSON.stringify(error));
        throw error;
      }
      
      console.log("Image saved successfully");
      return data;
    } catch (blobError: any) {
      console.error("Blob/File handling error:", blobError);
      throw new Error(`Error processing image data: ${blobError.message || JSON.stringify(blobError)}`);
    }
  } catch (error: any) {
    // Convert any error to a more descriptive format
    const errorMessage = error.message || JSON.stringify(error);
    const errorDetails = error.details || error.hint || error.code || '';
    console.error(`Error saving generated image: ${errorMessage}`, error);
    console.error(`Error details: ${errorDetails}`);
    throw new Error(`Failed to save image: ${errorMessage} ${errorDetails}`);
  }
}

// Get user's generated images
export async function getUserImages(userId: string) {
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Delete a generated image
export async function deleteGeneratedImage(imageId: string) {
  try {
    console.log('Starting image deletion process for ID:', imageId);
    
    // First get the image record
    const { data: imageData, error: fetchError } = await supabase
      .from('generated_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      console.error('Error fetching image data:', fetchError);
      throw fetchError;
    }
    
    if (!imageData) {
      console.error('Image not found with ID:', imageId);
      throw new Error('Image not found');
    }
    
    console.log('Image data retrieved:', {
      id: imageData.id,
      user_id: imageData.user_id,
      image_url: imageData.image_url
    });

    // Extract the file path from the URL
    // URL format: https://optqosltphgdqmdlkiuj.supabase.co/storage/v1/object/public/images/userId/filename.png
    const url = imageData.image_url;
    const bucketName = 'images';
    
    // Get path parts after the bucket name in the URL
    const pathRegex = new RegExp(`/storage/v1/object/public/${bucketName}/(.+)`);
    const match = url.match(pathRegex);
    let storagePath = '';
    
    if (match && match[1]) {
      storagePath = decodeURIComponent(match[1]);
      console.log('Extracted storage path:', storagePath);
    } else {
      // Fallback to direct construction
      const userId = imageData.user_id;
      const filename = url.substring(url.lastIndexOf('/') + 1);
      storagePath = `${userId}/${filename}`;
      console.log('Fallback storage path:', storagePath);
    }
    
    // Try listing files first to confirm the file exists
    console.log(`Checking if file exists in path: ${storagePath}`);
    const { data: listData, error: listError } = await supabase.storage
      .from(bucketName)
      .list(imageData.user_id, {
        limit: 100,
        search: storagePath.split('/').pop() || '',
      });
      
    if (listError) {
      console.error('Error listing files:', listError);
    } else {
      console.log('Files in directory:', listData);
    }

    // Now try deleting with explicit bucket name
    console.log(`Attempting to delete file: ${storagePath} from bucket: ${bucketName}`);
    const { data: deleteData, error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([storagePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      console.error('Storage error details:', JSON.stringify(storageError));
      
      // Try alternate path format as a fallback
      const altPath = storagePath.includes('/') ? storagePath : `${imageData.user_id}/${storagePath}`;
      console.log(`Trying alternate path format: ${altPath}`);
      const { error: altError } = await supabase.storage
        .from(bucketName)
        .remove([altPath]);
        
      if (altError) {
        console.error('Alternate path deletion also failed:', altError);
      } else {
        console.log('Alternate path deletion succeeded');
      }
    } else {
      console.log('Storage deletion response:', deleteData);
      console.log('Successfully deleted file from storage');
    }

    // Delete the database record regardless of storage deletion outcome
    const { error: dbError } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      console.error('Error deleting database record:', dbError);
      throw dbError;
    }

    console.log('Successfully deleted database record');
    return true;
  } catch (error: any) {
    console.error('Error in deleteGeneratedImage:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

// Storage helper functions
export async function uploadImage(file: File, userId: string) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`uploads/${fileName}`, file);
    
    if (error) throw error;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(`uploads/${fileName}`);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

