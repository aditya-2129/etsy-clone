"use client";

import * as React from "react";
import Image from "next/image";
import { getFilePreview } from "@/lib/services/storage.service";
import { BUCKET_PRODUCT_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative aspect-square w-16 md:w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
              selectedImage === index 
                ? "border-[var(--etsy-orange)] ring-1 ring-[var(--etsy-orange)]" 
                : "border-transparent hover:border-muted-foreground/30"
            )}
          >
            <Image
              src={getFilePreview(BUCKET_PRODUCT_IMAGES, image, { width: 100, height: 100 })}
              alt={`${title} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-square flex-1 rounded-2xl overflow-hidden bg-muted group">
        <Image
          src={getFilePreview(BUCKET_PRODUCT_IMAGES, images[selectedImage], { width: 800, height: 800 })}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Optional: Zoom overlay or indicator */}
      </div>
    </div>
  );
}
