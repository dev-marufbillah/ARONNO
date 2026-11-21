"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-[#f8f5ef]">
        <Image src={activeImage} alt={alt} width={1200} height={1400} className="h-auto w-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => (
          <button
            key={image}
            onClick={() => setActiveImage(image)}
            className={`overflow-hidden border ${activeImage === image ? "border-gold" : "border-black/10"}`}
          >
            <Image src={image} alt={alt} width={300} height={300} className="aspect-square h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
