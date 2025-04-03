'use client';

import {
  GlobeIcon,
  Link1Icon,
  VideoIcon,
  PersonIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { Button, Flex, Text, TextField, Box } from '@radix-ui/themes';

import { supabase } from '@/utils/supabase/client';
import SubmitDJLayout from '@/components/SubmitDJLayout';
import CreateDJNamePopover from '@/components/CreateDJNamePopover';
import { sanitizeUrl, validateSocialMediaUrl } from '@/utils/url.utils';
import { optimizeImage, validateImageDimensions } from '@/utils/image.utils';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<Blob | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    instagramUrl: '',
    facebookUrl: '',
    websiteUrl: '',
    youtubeUrl: '',
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid image file (JPEG, JPG, or PNG)');
      return;
    }

    setIsProcessingImage(true);

    // Validate dimensions
    const isValidDimensions = await validateImageDimensions(file, 400, 400);
    if (!isValidDimensions) {
      setError('Image must be at least 400x400 pixels');
      setIsProcessingImage(false);
      return;
    }

    try {
      // Optimize the image
      const optimized = await optimizeImage(file);
      setOptimizedImage(optimized);
      setPhotoPreview(URL.createObjectURL(optimized));

      setError(null);
    } catch (err) {
      console.error('Image optimization failed:', err);
      setError('Failed to process image. Please try another one.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const validateForm = (): boolean => {
    // Validate name
    if (!formData.name.trim()) {
      setError('DJ name is required');
      return false;
    }

    // Validate URLs
    const urls = {
      instagram: formData.instagramUrl,
      facebook: formData.facebookUrl,
      youtube: formData.youtubeUrl,
      website: formData.websiteUrl,
    };

    // Check if at least one URL is provided
    const hasAtLeastOneUrl = Object.values(urls).some(
      (url) => url.trim() !== ''
    );
    if (!hasAtLeastOneUrl) {
      setError('At least one social media URL is required');
      return false;
    }

    // Validate each provided URL
    for (const [platform, url] of Object.entries(urls)) {
      if (
        url.trim() &&
        !validateSocialMediaUrl(url, platform as keyof typeof urls)
      ) {
        setError(`Invalid ${platform} URL format`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form before proceeding
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      if (!optimizedImage) {
        setError('Please select a photo');
        setLoading(false);
        return;
      }

      // Upload optimized photo to Supabase Storage
      const extension = (optimizedImage as any).extension || 'webp';
      const fileName = `${uuidv4()}.${extension}`;
      const filePath = `dj-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('dj-photos')
        .upload(filePath, optimizedImage, {
          contentType: optimizedImage.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded photo
      const {
        data: { publicUrl },
      } = supabase.storage.from('dj-photos').getPublicUrl(filePath);

      // Sanitize URLs before saving
      const sanitizedFormData = {
        name: formData.name,
        instagram_url: formData.instagramUrl
          ? sanitizeUrl(formData.instagramUrl)
          : null,
        facebook_url: formData.facebookUrl
          ? sanitizeUrl(formData.facebookUrl)
          : null,
        website_url: formData.websiteUrl
          ? sanitizeUrl(formData.websiteUrl)
          : null,
        youtube_url: formData.youtubeUrl
          ? sanitizeUrl(formData.youtubeUrl)
          : null,
      };

      // Create new DJ record
      const { error: insertError } = await supabase.from('djs').insert([
        {
          id: uuidv4(),
          ...sanitizedFormData,
          photo: publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      // Redirect to home page on success
      router.push('/');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubmitDJLayout>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="8">
          {/* Photo Upload */}
          <Flex direction="column" gap="6" align="center">
            <Flex direction="column" gap="2">
              <Text size="2" weight="bold">
                DJ Photo
              </Text>
              <Text
                size="1"
                color="gray"
                style={{ opacity: 0.8, width: '80%' }}
              >
                Please upload a square photo (min 400x400 pixels).The image will
                be optimized automatically to 500x500 pixels
              </Text>
            </Flex>

            <Flex direction="column" gap="3" align="center">
              <Box
                width="200px"
                height="200px"
                style={{ position: 'relative' }}
              >
                <Image
                  src={photoPreview || '/default_photo.jpg'}
                  alt="DJ Photo"
                  fill
                  style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                    opacity: isProcessingImage ? 0.5 : 1,
                  }}
                />
                {isProcessingImage && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '8px 16px',
                      borderRadius: '4px',
                    }}
                  >
                    Processing...
                  </Box>
                )}
              </Box>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handlePhotoChange}
                disabled={isProcessingImage}
              />
            </Flex>
          </Flex>

          {/* Name Input */}
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Text size="2" weight="bold">
                DJ Name
              </Text>
              <Text
                size="1"
                color="gray"
                style={{ opacity: 0.8, width: '80%' }}
              >
                Please add the DJ's main artist name.
              </Text>
            </Flex>
            <Flex direction="row" gap="2">
              <TextField.Root
                placeholder="DJ Name* (its main artist name)"
                style={{ flex: 1 }}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              >
                <TextField.Slot>
                  <PersonIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>

              <CreateDJNamePopover />
            </Flex>
          </Flex>

          {/* Social Media URLs */}
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Text size="2" weight="bold">
                Social Media URLs
              </Text>
              <Text
                size="1"
                color="gray"
                style={{ opacity: 0.8, width: '80%' }}
              >
                Please add at least one DJ's social media URL. It will help us
                identify which DJ you're talking about.
              </Text>
            </Flex>
            <TextField.Root
              placeholder="Instagram URL"
              value={formData.instagramUrl}
              onChange={(e) =>
                setFormData({ ...formData, instagramUrl: e.target.value })
              }
            >
              <TextField.Slot>
                <InstagramLogoIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>

            <TextField.Root
              placeholder="Facebook URL"
              value={formData.facebookUrl}
              onChange={(e) =>
                setFormData({ ...formData, facebookUrl: e.target.value })
              }
            >
              <TextField.Slot>
                <Link1Icon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>

            <TextField.Root
              placeholder="Website URL"
              value={formData.websiteUrl}
              onChange={(e) =>
                setFormData({ ...formData, websiteUrl: e.target.value })
              }
            >
              <TextField.Slot>
                <GlobeIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>

            <TextField.Root
              placeholder="YouTube URL"
              value={formData.youtubeUrl}
              onChange={(e) =>
                setFormData({ ...formData, youtubeUrl: e.target.value })
              }
            >
              <TextField.Slot>
                <VideoIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Flex>

          {error && (
            <Text color="red" size="2">
              {error}
            </Text>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting DJ...' : 'Submit DJ'}
          </Button>
        </Flex>
      </form>
    </SubmitDJLayout>
  );
}
