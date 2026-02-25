"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export interface ProgressPhoto {
  id: string;
  measurementId: string | null;
  photoUrl: string;
  photoType: "front" | "side" | "back";
  takenAt: string;
}

export function useProgressPhotos() {
  const supabase = createClient();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("progress_photos")
        .select("*")
        .eq("user_id", user.id)
        .order("taken_at", { ascending: false });

      if (data) {
        setPhotos(data.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          measurementId: p.measurement_id as string | null,
          photoUrl: p.photo_url as string,
          photoType: p.photo_type as "front" | "side" | "back",
          takenAt: p.taken_at as string,
        })));
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const compressImage = useCallback(async (file: File, maxWidth = 800): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(blob!),
          "image/jpeg",
          0.8
        );
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const uploadPhoto = useCallback(async (
    file: File,
    photoType: "front" | "side" | "back",
    date: string,
    measurementId?: string
  ) => {
    setUploading(true);
    if (!user) { setUploading(false); return; }

    const compressed = await compressImage(file);
    const fileName = `${user.id}/${date}_${photoType}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("progress-photos")
      .upload(fileName, compressed, { contentType: "image/jpeg" });

    if (uploadError) {
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("progress-photos")
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("progress_photos")
      .insert({
        user_id: user.id,
        measurement_id: measurementId || null,
        photo_url: publicUrl,
        photo_type: photoType,
        taken_at: date,
      })
      .select()
      .single();

    if (data && !error) {
      const newPhoto: ProgressPhoto = {
        id: data.id,
        measurementId: data.measurement_id,
        photoUrl: data.photo_url,
        photoType: data.photo_type,
        takenAt: data.taken_at,
      };
      setPhotos((prev) => [newPhoto, ...prev]);
    }
    setUploading(false);
  }, [supabase, compressImage, user]);

  const deletePhoto = useCallback(async (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    // Extract file path from URL
    const url = new URL(photo.photoUrl);
    const pathParts = url.pathname.split("/progress-photos/");
    if (pathParts[1]) {
      await supabase.storage.from("progress-photos").remove([pathParts[1]]);
    }

    await supabase.from("progress_photos").delete().eq("id", photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }, [photos, supabase]);

  return { photos, loading, uploading, uploadPhoto, deletePhoto };
}
