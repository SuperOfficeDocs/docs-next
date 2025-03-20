import React from "react";
import {
  CloudArrowUp,
  Power,
  MapTrifold,
  GraduationCap,
  Files,
  Compass,
  Bug,
  ListDashes,
  Video,
  CloudArrowDown,
  MapPin,
} from "@phosphor-icons/react";

type IconType =
  | "architecture"
  | "explore"
  | "cloud_upload"
  | "file_download"
  | "power_settings_new"
  | "list"
  | "school"
  | "map"
  | "place"
  | "library_books"
  | "dvr"
  | "video_library"
  | "new_releases";

interface IconSelectionProps {
  iconType: IconType;
  size: number;
  color: string;
}

export default function IconSelection({
  iconType,
  size,
  color,
}: IconSelectionProps) {
  const IconList: Record<IconType, React.ElementType> = {
    architecture: Bug, // Yet to define
    explore: Compass,
    cloud_upload: CloudArrowUp,
    file_download: CloudArrowDown,
    power_settings_new: Power,
    list: ListDashes,
    school: GraduationCap,
    map: MapTrifold,
    place: MapPin,
    library_books: Files,
    dvr: Bug, // Yet to define
    video_library: Video,
    new_releases: Bug, // Yet to define
  };

  const SelectedIcon = IconList[iconType] || Bug;

  return <SelectedIcon size={size} color={color} />;
}
