"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Loader2, Save, Store, X } from "lucide-react";
import { toast } from "sonner";
import { 
  updateShopSchema, 
  type UpdateShopFormData 
} from "@/lib/validations";
import { getShopById, updateShop } from "@/lib/services/shop.service";
import { uploadFile, getFilePreview } from "@/lib/services/storage.service";
import { BUCKET_SHOP_ASSETS } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import type { Shop } from "@/lib/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// =============================================================================
// Shop Settings Page
// =============================================================================

export default function ShopSettingsPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [existingLogo, setExistingLogo] = useState<string | null>(null);
  const [newLogoFile, setNewLogoFile] = useState<{file: File, preview: string} | null>(null);

  const [existingBanner, setExistingBanner] = useState<string | null>(null);
  const [newBannerFile, setNewBannerFile] = useState<{file: File, preview: string} | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateShopFormData>({
    resolver: zodResolver(updateShopSchema),
  });

  // 1. Load data
  useEffect(() => {
    async function loadShop() {
      if (!user?.shopId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const shopData = await getShopById(user.shopId);
        setShop(shopData);
        setExistingLogo(shopData.logo);
        setExistingBanner(shopData.banner);
        
        reset({
          name: shopData.name,
          description: shopData.description || "",
          location: shopData.location || "",
          policies: shopData.policies || "",
        });

      } catch (error) {
        console.error("Failed to load shop:", error);
        toast.error("Could not load your shop details.");
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      loadShop();
    }
  }, [user, reset]);

  // 2. Image Handling - Logo
  const onDropLogo = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setNewLogoFile({
      file,
      preview: URL.createObjectURL(file)
    });
  }, []);

  const { getRootProps: getLogoProps, getInputProps: getLogoInputProps } = useDropzone({ 
    onDrop: onDropLogo, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 2 * 1024 * 1024, // 2MB for logo
    maxFiles: 1,
  });

  const removeNewLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newLogoFile) {
      URL.revokeObjectURL(newLogoFile.preview);
      setNewLogoFile(null);
    }
  };

  const removeExistingLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExistingLogo(null);
  };

  // 3. Image Handling - Banner
  const onDropBanner = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setNewBannerFile({
      file,
      preview: URL.createObjectURL(file)
    });
  }, []);

  const { getRootProps: getBannerProps, getInputProps: getBannerInputProps } = useDropzone({ 
    onDrop: onDropBanner, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB for banner
    maxFiles: 1,
  });

  const removeNewBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newBannerFile) {
      URL.revokeObjectURL(newBannerFile.preview);
      setNewBannerFile(null);
    }
  };

  const removeExistingBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExistingBanner(null);
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (newLogoFile) URL.revokeObjectURL(newLogoFile.preview);
      if (newBannerFile) URL.revokeObjectURL(newBannerFile.preview);
    };
  }, [newLogoFile, newBannerFile]);

  // 4. Submit
  const onSubmit = async (data: UpdateShopFormData) => {
    if (!user || !user.shopId) return;

    setIsSubmittingForm(true);
    try {
      let finalLogoId = existingLogo;
      let finalBannerId = existingBanner;

      toast.loading("Saving changes...", { id: "save" });

      // Upload new logo if any
      if (newLogoFile) {
        toast.loading("Uploading logo...", { id: "save" });
        const logoDoc = await uploadFile(BUCKET_SHOP_ASSETS, newLogoFile.file, user.userId);
        finalLogoId = logoDoc.$id;
      }

      // Upload new banner if any
      if (newBannerFile) {
        toast.loading("Uploading banner...", { id: "save" });
        const bannerDoc = await uploadFile(BUCKET_SHOP_ASSETS, newBannerFile.file, user.userId);
        finalBannerId = bannerDoc.$id;
      }

      toast.loading("Updating shop details...", { id: "save" });
      
      const payload = {
        ...data,
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        location: data.location ?? undefined,
        policies: data.policies ?? undefined,
        logo: finalLogoId ?? undefined, // Using undefined handles the case where it's intentionally empty
        banner: finalBannerId ?? undefined,
      };

      await updateShop(user.shopId, payload);
      
      toast.success("Shop settings updated successfully!");
      setNewLogoFile(null);
      setNewBannerFile(null);
      
      // Refresh context to pull updated user data if name impacts anything
      await refreshUser();
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to update shop settings.");
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

  if (!user?.shopId || !shop) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <Store className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
        <h2 className="text-2xl font-bold">No Shop Found</h2>
        <p className="text-muted-foreground mt-2">You need to set up a shop before editing settings.</p>
        <Button className="mt-6 bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)]" onClick={() => router.push("/seller/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
        <p className="text-[var(--muted-foreground)]">Customize your storefront and update your policies.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Brand & Identity */}
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b bg-muted/30">
            <h2 className="text-lg font-semibold">Brand & Identity</h2>
          </div>
          
          <div className="p-6 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Shop Logo */}
              <div className="space-y-4">
                <Label>Shop Logo</Label>
                <div className="text-xs text-muted-foreground mb-2">A square image, ideally 500x500px, under 2MB.</div>
                
                <div 
                  {...getLogoProps()} 
                  className="w-40 h-40 border-2 border-dashed rounded-full flex flex-col items-center justify-center relative cursor-pointer overflow-hidden group hover:border-[var(--etsy-orange)] transition-colors mx-auto md:mx-0"
                >
                  <input {...getLogoInputProps()} />
                  
                  {newLogoFile ? (
                    <>
                      <img src={newLogoFile.preview} alt="New Logo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button type="button" variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={removeNewLogo}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : existingLogo ? (
                    <>
                      <img src={getFilePreview(BUCKET_SHOP_ASSETS, existingLogo, { width: 250, height: 250 })} alt="Current Logo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button type="button" variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={removeExistingLogo}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center px-4 text-center">
                      <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Upload Logo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shop Details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Shop Name *</Label>
                  <Input 
                    id="name" 
                    {...register("name")} 
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Shop Location</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g. Mumbai, India" 
                    {...register("location")} 
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-8 space-y-4">
              <Label>Shop Banner</Label>
              <div className="text-xs text-muted-foreground mb-2">A wide image to show at the top of your shop, ideally 1200x300px, under 5MB.</div>
              
              <div 
                {...getBannerProps()} 
                className="w-full h-48 border-2 border-dashed rounded-xl flex items-center justify-center relative cursor-pointer overflow-hidden group hover:border-[var(--etsy-orange)] transition-colors"
              >
                <input {...getBannerInputProps()} />
                
                {newBannerFile ? (
                  <>
                    <img src={newBannerFile.preview} alt="New Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="destructive" size="icon" className="rounded-full" onClick={removeNewBanner}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                ) : existingBanner ? (
                  <>
                    <img src={getFilePreview(BUCKET_SHOP_ASSETS, existingBanner, { width: 1200, height: 300 })} alt="Current Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="destructive" size="icon" className="rounded-full" onClick={removeExistingBanner}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <ImagePlus className="h-10 w-10 mb-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Click or drag an image here for your banner</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About & Policies */}
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b bg-muted/30">
            <h2 className="text-lg font-semibold">About & Policies</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Shop Announcement / Description</Label>
              <Textarea 
                id="description" 
                placeholder="Welcome buyers and tell them about your creations..." 
                className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                {...register("description")} 
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              <p className="text-xs text-muted-foreground">Appears at the top of your shop page.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policies">Shop Policies</Label>
              <Textarea 
                id="policies" 
                placeholder="Write your return, exchange, and shipping policies here..." 
                className={`min-h-[200px] ${errors.policies ? "border-destructive" : ""}`}
                {...register("policies")} 
              />
              {errors.policies && <p className="text-xs text-destructive">{errors.policies.message}</p>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmittingForm} 
            className="bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange-hover)] px-8 h-11 rounded-xl text-base shadow-sm"
          >
            {isSubmittingForm ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
