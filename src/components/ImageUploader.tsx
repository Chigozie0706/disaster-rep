import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ipfsService } from '@/lib/ipfsService';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (ipfsUrl: string) => void;
  currentImage?: string;
  disabled?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage,
  disabled = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to IPFS
    uploadToIPFS(file);
  };

  const uploadToIPFS = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await ipfsService.uploadFileData(file);
      
      if (result.success && result.ipfsUrl) {
        onImageUploaded(result.ipfsUrl);
        toast({
          title: "Image uploaded successfully",
          description: "Your image has been stored on IPFS"
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
      setPreviewUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {previewUrl ? (
        <Card className="relative overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="sm"
            type="button"
              className="absolute top-2 right-2"
              onClick={clearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to IPFS...</span>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-primary/50 cursor-pointer transition-colors"
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        >
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              {isUploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Uploading to IPFS...
                  </p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-primary/10">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={disabled}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
