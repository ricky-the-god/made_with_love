"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Camera, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { saveProfileSettings } from "@/server/settings-actions";

interface ProfileDetailsFormProps {
  initialName: string;
  initialAvatarUrl: string;
}

type AvatarUploadResult =
  | {
      error: string;
    }
  | {
      avatarUrl: string;
      uploadedPath: string | null;
    };

export function ProfileDetailsForm({ initialName, initialAvatarUrl }: ProfileDetailsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setLocalPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setLocalPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const previewName = name.trim() || "My Account";
  const previewAvatarUrl = localPreviewUrl || avatarUrl;
  const initials = previewName.charAt(0).toUpperCase() || "M";

  function resetFileSelection() {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function getStoragePathFromUrl(url: string) {
    const marker = "/storage/v1/object/public/profile-photos/";
    const markerIndex = url.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return url.slice(markerIndex + marker.length);
  }

  async function uploadSelectedAvatar(currentAvatarUrl: string): Promise<AvatarUploadResult> {
    if (!selectedFile) {
      return { avatarUrl: currentAvatarUrl, uploadedPath: null as string | null };
    }

    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be signed in to upload a profile picture." };
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
    if (!allowedTypes.has(selectedFile.type)) {
      return { error: "Upload a JPG, PNG, WebP, or GIF image." };
    }

    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      return { error: "Profile pictures must be 5 MB or smaller." };
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("profile-photos").upload(path, selectedFile, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-photos").getPublicUrl(path);

    return { avatarUrl: publicUrl, uploadedPath: path };
  }

  async function handleSave() {
    setIsSaving(true);

    const previousAvatarUrl = avatarUrl;
    let uploadedPath: string | null = null;

    try {
      const uploadResult = await uploadSelectedAvatar(previousAvatarUrl);

      if ("error" in uploadResult) {
        toast.error(uploadResult.error);
        return;
      }

      uploadedPath = uploadResult.uploadedPath ?? null;

      const result = await saveProfileSettings({
        full_name: name,
        avatar_url: uploadResult.avatarUrl,
      });

      if (result.error) {
        if (uploadedPath) {
          const supabase = createClient();
          await supabase.storage.from("profile-photos").remove([uploadedPath]);
        }
        toast.error(result.error);
        return;
      }

      if (uploadedPath && previousAvatarUrl) {
        const previousPath = getStoragePathFromUrl(previousAvatarUrl);
        if (previousPath) {
          const supabase = createClient();
          await supabase.storage.from("profile-photos").remove([previousPath]);
        }
      }

      setAvatarUrl(uploadResult.avatarUrl);
      resetFileSelection();
      toast.success("Profile updated.");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemovePhoto() {
    if (!avatarUrl && !selectedFile) {
      return;
    }

    setIsSaving(true);

    try {
      const result = await saveProfileSettings({
        full_name: name,
        avatar_url: null,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      const existingPath = avatarUrl ? getStoragePathFromUrl(avatarUrl) : null;
      if (existingPath) {
        const supabase = createClient();
        await supabase.storage.from("profile-photos").remove([existingPath]);
      }

      setAvatarUrl("");
      resetFileSelection();
      toast.success("Profile picture removed.");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-20 rounded-2xl">
          <AvatarImage src={previewAvatarUrl || undefined} alt={previewName} className="rounded-2xl object-cover" />
          <AvatarFallback className="rounded-2xl bg-amber-100 text-3xl text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Camera className="size-4 text-amber-700" />
            Profile picture preview
          </div>
          <p className="text-muted-foreground text-sm">Upload a JPG, PNG, WebP, or GIF image up to 5 MB.</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Display name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="How your family sees your name"
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-avatar-upload">Profile picture</Label>
          <input
            ref={fileInputRef}
            id="profile-avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={isSaving}
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/30 dark:bg-amber-950/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {selectedFile ? selectedFile.name : avatarUrl ? "Current photo saved" : "No photo uploaded yet"}
              </p>
              <p className="text-muted-foreground text-xs">
                {selectedFile
                  ? "This selected image will be uploaded when you save your profile."
                  : "Choose a file from your device to replace the initials avatar."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" disabled={isSaving} onClick={() => fileInputRef.current?.click()}>
                <Upload className="size-4" />
                {selectedFile || avatarUrl ? "Change image" : "Choose image"}
              </Button>
              {(avatarUrl || selectedFile) && (
                <Button type="button" variant="outline" disabled={isSaving} onClick={handleRemovePhoto}>
                  <Trash2 className="size-4" />
                  Remove photo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-amber-700 text-white hover:bg-amber-800"
        >
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
