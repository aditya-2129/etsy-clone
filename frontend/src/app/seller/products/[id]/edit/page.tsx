"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X, Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { 
  updateProductSchema, 
  type UpdateProductFormData 
} from "@/lib/validations";
import { listCategories } from "@/lib/services/category.service";
import { uploadMultipleFiles, getFilePreview } from "@/lib/services/storage.service";
import { getProductById, updateProduct } from "@/lib/services/product.service";
import { BUCKET_PRODUCT_IMAGES } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import type { Category, Product } from "@/lib/types";

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
import { Button } from "@/components/ui/button";

// =============================================================================
// Edit Listing Page — Allows sellers to update existing products
// =============================================================================

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const [tagsInput, setTagsInput] = useState("");
  const [materialsInput, setMaterialsInput] = useState("");
  
  // Images state
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<{file: File, preview: string}[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
  });

  // 1. Load data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [categoriesData, productData] = await Promise.all([
          listCategories(),
          getProductById(id)
        ]);
        
        setCategories(categoriesData);
        setIsCategoriesLoading(false);
        setProduct(productData);
        setExistingImages(productData.images || []);
        
        // Pre-populate form
        reset({
          title: productData.title,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          compareAtPrice: productData.compareAtPrice,
          stock: productData.stock,
          shippingCost: productData.shippingCost,
          processingTime: productData.processingTime,
          categoryId: productData.categoryId,
          tags: productData.tags || [],
          materials: productData.materials || [],
          isPublished: productData.isPublished,
        });

        if (productData.tags) setTagsInput(productData.tags.join(", "));
        if (productData.materials) setMaterialsInput(productData.materials.join(", "));

      } catch (error) {
        console.error("Failed to load data", error);
        toast.error("Could not find this product.");
        router.push("/seller/products");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, [id, reset, router]);

  // 2. Image Handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setNewImageFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
  });

  const removeExistingImage = (idx: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx: number) => {
    setNewImageFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[idx].preview);
      updated.splice(idx, 1);
      return updated;
    });
  };

  useEffect(() => {
    return () => newImageFiles.forEach(item => URL.revokeObjectURL(item.preview));
  }, [newImageFiles]);

  // 3. Submit
  const onSubmit = async (data: UpdateProductFormData) => {
    if (!user || !user.userId) return;

    setIsSubmittingForm(true);
    try {
      let finalImageIds = [...existingImages];

      // Upload new images if any
      if (newImageFiles.length > 0) {
        toast.loading("Uploading new images...", { id: "upload" });
        const uploadedIds = await uploadMultipleFiles(
          BUCKET_PRODUCT_IMAGES,
          newImageFiles.map(f => f.file),
          user.userId
        );
        finalImageIds = [...finalImageIds, ...uploadedIds];
        toast.dismiss("upload");
      }

      toast.loading("Saving changes...", { id: "save" });
      
      const payload = {
        ...data,
        images: finalImageIds,
        compareAtPrice: data.compareAtPrice ?? undefined,
        shippingCost: data.shippingCost ?? undefined,
        processingTime: data.processingTime ?? undefined,
      };

      await updateProduct(id, payload);
      
      toast.success("Product updated successfully!");
      router.push("/seller/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product.");
    } finally {
      toast.dismiss("save");
      setIsSubmittingForm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--etsy-orange)]" />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Listing</h1>
          <p className="text-muted-foreground">{product?.title}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  className={errors.slug ? "border-destructive" : ""}
                />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select 
                  onValueChange={(val) => setValue("categoryId", val, { shouldValidate: true })} 
                  value={watch("categoryId")}
                >
                  <SelectTrigger id="categoryId" className={errors.categoryId ? "border-destructive" : ""}>
                    <SelectValue placeholder={isCategoriesLoading ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.$id} value={c.$id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  className={`min-h-[150px] ${errors.description ? "border-destructive" : ""}`}
                  {...register("description")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Media</h2>
            <div className="space-y-4">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-[var(--etsy-orange)] bg-[var(--etsy-orange)]/5' : 'border-border hover:border-muted-foreground/50'}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="h-8 w-8" />
                  <p className="text-sm font-medium">Add more images</p>
                </div>
              </div>

              {/* Combined Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((id, idx) => (
                  <div key={`existing-${id}`} className="relative group aspect-square rounded-lg border overflow-hidden">
                    <img 
                      src={getFilePreview(BUCKET_PRODUCT_IMAGES, id, { width: 150, height: 150 })} 
                      alt="existing" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[8px] rounded uppercase font-bold tracking-tight">Saved</div>
                  </div>
                ))}
                
                {/* New Images */}
                {newImageFiles.map((item, idx) => (
                  <div key={`new-${idx}`} className="relative group aspect-square rounded-lg border border-[var(--etsy-orange)]/30 overflow-hidden">
                    <img src={item.preview} alt="new" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[var(--etsy-orange)] text-white text-[8px] rounded uppercase font-bold tracking-tight">New</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Pricing & Inventory</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Compare at price (₹)</Label>
                <Input id="compareAtPrice" type="number" step="0.01" {...register("compareAtPrice", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Visibility</h2>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Published Status</Label>
                <p className="text-sm text-muted-foreground">Is this product visible to buyers?</p>
              </div>
              <Switch 
                checked={watch("isPublished")} 
                onCheckedChange={(val) => setValue("isPublished", val)} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmittingForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmittingForm} className="bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] px-8 h-11 rounded-xl">
              {isSubmittingForm ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
