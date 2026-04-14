"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  createProductSchema, 
  type CreateProductFormData 
} from "@/lib/validations";
import { listCategories } from "@/lib/services/category.service";
import { uploadMultipleFiles } from "@/lib/services/storage.service";
import { createProduct } from "@/lib/services/product.service";
import { BUCKET_PRODUCT_IMAGES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import type { Category } from "@/lib/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const [tagsInput, setTagsInput] = useState("");
  const [materialsInput, setMaterialsInput] = useState("");
  const [imageFiles, setImageFiles] = useState<{file: File, preview: string}[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: undefined,
      compareAtPrice: undefined,
      stock: undefined,
      shippingCost: undefined,
      processingTime: "",
      categoryId: "",
      tags: [],
      materials: [],
      isPublished: true,
    },
  });

  const title = watch("title");

  // Load Categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await listCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [title, setValue]);

  // Handle Drag & Drop Images
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImageFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imageFiles.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const onSubmit = async (data: CreateProductFormData) => {
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }
    if (!user.shopId) {
      toast.error("You need to set up a shop first.");
      return;
    }

    setIsSubmittingForm(true);
    try {
      let uploadedImageIds: string[] = [];
      if (imageFiles.length > 0) {
        toast.loading("Uploading images...", { id: "upload-toast" });
        uploadedImageIds = await uploadMultipleFiles(
          BUCKET_PRODUCT_IMAGES,
          imageFiles.map(f => f.file),
          user.userId
        );
        toast.dismiss("upload-toast");
      }

      toast.loading("Creating product...", { id: "create-toast" });
      const productPayload = {
        ...data,
        compareAtPrice: data.compareAtPrice ?? undefined,
        shippingCost: data.shippingCost ?? undefined,
        processingTime: data.processingTime ?? undefined,
        sellerId: user.userId,
        shopId: user.shopId,
        images: uploadedImageIds,
      };

      await createProduct(productPayload);
      toast.success("Product published successfully!");
      router.push("/seller/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      toast.dismiss("create-toast");
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Add a new listing</h1>
          <p className="text-muted-foreground mt-2">
            Showcase your product with detailed information and high-quality images.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          {/* Section: Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Title */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Vintage Leather Crossbody Bag"
                  className={errors.title ? "border-[var(--etsy-error)] focus-visible:ring-[var(--etsy-error)]" : ""}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.title.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Catchy titles attract more viewers.</p>
              </div>

              {/* Slug */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  placeholder="vintage-leather-crossbody-bag"
                  className={errors.slug ? "border-[var(--etsy-error)] focus-visible:ring-[var(--etsy-error)]" : ""}
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.slug.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select 
                  onValueChange={(val) => setValue("categoryId", val, { shouldValidate: true })} 
                  value={watch("categoryId")}
                >
                  <SelectTrigger 
                    id="categoryId" 
                    className={errors.categoryId ? "border-[var(--etsy-error)]" : ""}
                  >
                    <SelectValue placeholder={isCategoriesLoading ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.$id} value={c.$id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell buyers about your item..."
                  className={`min-h-[150px] ${errors.description ? "border-[var(--etsy-error)] focus-visible:ring-[var(--etsy-error)]" : ""}`}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Media */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Media</h2>
            
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-[var(--etsy-orange)] bg-[var(--etsy-orange)]/5' : 'border-border hover:border-muted-foreground/50'}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="h-8 w-8" />
                  <p className="text-sm font-medium">Drag & drop images here, or click to select</p>
                  <p className="text-xs">Supports JPG, PNG, WEBP up to 5MB.</p>
                </div>
              </div>

              {/* Previews */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                  {imageFiles.map((fileObj, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg border overflow-hidden shadow-sm">
                      <img 
                        src={fileObj.preview} 
                        alt={`preview ${idx}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: Pricing & Inventory */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Pricing & Inventory</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="1000"
                  className={errors.price ? "border-[var(--etsy-error)] focus-visible:ring-[var(--etsy-error)]" : ""}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.price.message}</p>
                )}
              </div>

              {/* Compare at Price */}
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Compare at price (₹)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  placeholder="1500"
                  className={errors.compareAtPrice ? "border-[var(--etsy-error)] focus-visible:ring-[var(--etsy-error)]" : ""}
                  {...register("compareAtPrice", { 
                    setValueAs: (v) => v === "" ? undefined : parseFloat(v)
                  })}
                />
                {errors.compareAtPrice && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.compareAtPrice.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Original price before discount.</p>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Inventory Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="10"
                  className={errors.stock ? "border-[var(--etsy-error)] focus-visible:ring-[var(--etsy-error)]" : ""}
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.stock.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Details & Shipping */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Details & Shipping</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="vintage, leather, handbag"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                    setValue("tags", e.target.value.split(',').map(t => t.trim()).filter(Boolean));
                  }}
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <Label htmlFor="materials">Materials</Label>
                <Input
                  id="materials"
                  placeholder="genuine leather, brass hardware"
                  value={materialsInput}
                  onChange={(e) => {
                    setMaterialsInput(e.target.value);
                    setValue("materials", e.target.value.split(',').map(t => t.trim()).filter(Boolean));
                  }}
                />
                <p className="text-xs text-muted-foreground">Separate materials with commas.</p>
              </div>

              {/* Shipping Cost */}
              <div className="space-y-2">
                <Label htmlFor="shippingCost">Shipping Cost (₹)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  step="0.01"
                  placeholder="50"
                  className={errors.shippingCost ? "border-[var(--etsy-error)] focus-visible:ring-[var(--etsy-error)]" : ""}
                  {...register("shippingCost", { 
                    setValueAs: (v) => v === "" ? undefined : parseFloat(v)
                  })}
                />
                {errors.shippingCost && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.shippingCost.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Leave empty or 0 for Free Shipping.</p>
              </div>

              {/* Processing Time */}
              <div className="space-y-2">
                <Label htmlFor="processingTime">Processing Time</Label>
                <Input
                  id="processingTime"
                  placeholder="e.g. 1-3 business days"
                  className={errors.processingTime ? "border-[var(--etsy-error)] focus-visible:ring-[var(--etsy-error)]" : ""}
                  {...register("processingTime")}
                />
                {errors.processingTime && (
                  <p className="text-xs text-[var(--etsy-error)]">{errors.processingTime.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Visibility Settings */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Visibility Settings</h2>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Publish Listing</Label>
                <p className="text-sm text-muted-foreground">
                  Make this product instantly visible to buyers when you submit.
                </p>
              </div>
              <Switch 
                checked={watch("isPublished")} 
                onCheckedChange={(val) => setValue("isPublished", val)} 
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmittingForm}
              className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmittingForm}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--etsy-orange)] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[var(--etsy-orange-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmittingForm ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
