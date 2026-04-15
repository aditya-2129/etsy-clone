"use client";

import { useAuth } from "@/contexts/AuthContext";
import { updateUser } from "@/lib/services/user.service";
import { updateProfileSchema, type UpdateProfileFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Phone, MapPin, Save } from "lucide-react";
import { useEffect } from "react";

export default function SettingsPage() {
  const { user, refreshUser, isLoading: authLoading } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      addresses: user?.addresses || "",
    },
  });

  // Reset form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone || "",
        addresses: user.addresses || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    if (!user) return;

    try {
      await updateUser(user.$id, data);
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Unable to update profile. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Profile Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your personal information and shipping details
        </p>
      </div>

      <Card className="rounded-3xl shadow-sm border-border/60">
        <CardHeader className="pb-8">
          <CardTitle className="text-xl">Personal Information</CardTitle>
          <CardDescription>
            These details will be used for your orders and communications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="rounded-xl h-12 focus-visible:ring-[var(--etsy-orange)]"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-xs font-medium text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold opacity-70">
                Email Address
              </Label>
              <Input
                id="email"
                value={user?.email}
                disabled
                className="rounded-xl h-12 bg-muted/50 cursor-not-allowed border-dashed"
              />
              <p className="text-[10px] text-muted-foreground italic">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                className="rounded-xl h-12 focus-visible:ring-[var(--etsy-orange)]"
                placeholder="10-digit mobile number"
              />
              {errors.phone && (
                <p className="text-xs font-medium text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addresses" className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Shipping Address
              </Label>
              <Textarea
                id="addresses"
                {...register("addresses")}
                rows={4}
                className="rounded-2xl resize-none focus-visible:ring-[var(--etsy-orange)]"
                placeholder="Enter your default shipping address..."
              />
              {errors.addresses && (
                <p className="text-xs font-medium text-destructive mt-1">{errors.addresses.message}</p>
              )}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="w-full md:w-auto min-w-[160px] rounded-full h-12 shadow-lg transition-all active:scale-95 bg-[var(--etsy-orange)] hover:bg-[var(--etsy-orange)]/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
