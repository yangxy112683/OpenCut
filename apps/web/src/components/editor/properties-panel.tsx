"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTimelineStore } from "@/stores/timeline-store";
import { useMediaStore } from "@/stores/media-store";
import { ImageTimelineTreatment } from "@/components/ui/image-timeline-treatment";
import { useState } from "react";
import { SpeedControl } from "./speed-control";
import type { BackgroundType } from "@/types/editor";

export function PropertiesPanel() {
  const { tracks } = useTimelineStore();
  const { mediaItems } = useMediaStore();
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("blur");
  const [backgroundColor, setBackgroundColor] = useState("#000000");

  // Get the first video element for preview (simplified)
  const firstVideoElement = tracks
    .flatMap((track) => track.elements)
    .find((element) => {
      if (element.type !== "media") return false;
      const mediaItem = mediaItems.find((item) => item.id === element.mediaId);
      return mediaItem?.type === "video";
    });

  const firstVideoItem = firstVideoElement && firstVideoElement.type === "media"
    ? mediaItems.find((item) => item.id === firstVideoElement.mediaId)
    : null;

  const firstImageElement = tracks
    .flatMap((track) => track.elements)
    .find((element) => {
      if (element.type !== "media") return false;
      const mediaItem = mediaItems.find((item) => item.id === element.mediaId);
      return mediaItem?.type === "image";
    });

  const firstImageItem = firstImageElement && firstImageElement.type === "media"
    ? mediaItems.find((item) => item.id === firstImageElement.mediaId)
    : null;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-5">
        {/* Image Treatment - only show if an image is selected */}
        {firstImageItem && (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Image Treatment</h3>
              <div className="space-y-4">
                {/* Preview */}
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="w-full aspect-video max-w-48">
                    <ImageTimelineTreatment
                      src={firstImageItem.url!}
                      alt={firstImageItem.name}
                      targetAspectRatio={16 / 9}
                      className="rounded-sm border"
                      backgroundType={backgroundType}
                      backgroundColor={backgroundColor}
                    />
                  </div>
                </div>

                {/* Background Type */}
                <div className="space-y-2">
                  <Label htmlFor="bg-type">Background Type</Label>
                  <Select
                    value={backgroundType}
                    onValueChange={(value: BackgroundType) =>
                      setBackgroundType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select background type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blur">Blur</SelectItem>
                      <SelectItem value="mirror">Mirror</SelectItem>
                      <SelectItem value="color">Solid Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Background Color - only show for color type */}
                {backgroundType === "color" && (
                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Video Controls - only show if a video is selected */}
        {firstVideoItem && (
          <>
            <SpeedControl />
            <Separator />
          </>
        )}

        {/* Transform */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Transform</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="x">X Position</Label>
                <Input id="x" type="number" defaultValue="0" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="y">Y Position</Label>
                <Input id="y" type="number" defaultValue="0" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="rotation">Rotation</Label>
              <Slider
                id="rotation"
                max={360}
                step={1}
                defaultValue={[0]}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Effects */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Effects</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="opacity">Opacity</Label>
              <Slider
                id="opacity"
                max={100}
                step={1}
                defaultValue={[100]}
                className="mt-2"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="blur">Blur</Label>
              <Slider
                id="blur"
                max={20}
                step={0.5}
                defaultValue={[0]}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Timing */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Timing</h3>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                step="0.1"
                defaultValue="5"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="delay">Delay (seconds)</Label>
              <Input
                id="delay"
                type="number"
                min="0"
                step="0.1"
                defaultValue="0"
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
