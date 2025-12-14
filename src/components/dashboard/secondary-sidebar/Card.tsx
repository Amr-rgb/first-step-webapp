"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { Pencil, Trash, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEventsStore } from "@/store/eventsStore";
import { useOccasions } from "@/hooks/useOccasions";

type CardProps = {
  id: string;
  type: "occasion" | "birthday";
  title: string;
  date: string;
  rawDate: Date;
  isNew?: boolean;
  onEditComplete?: () => void;
};

const Card = ({
  id,
  type,
  title,
  date,
  rawDate,
  isNew = false,
  onEditComplete,
}: CardProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(isNew);
  const [newTitle, setNewTitle] = useState(title);
  const [newDate, setNewDate] = useState(rawDate.toISOString().split("T")[0]);

  // Focus on title input when entering edit mode
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  const { editBirthday, deleteBirthday } = useEventsStore();
  const { updateOccasion, deleteOccasion } = useOccasions();

  const handleSave = () => {
    const updated = { title: newTitle, date: new Date(newDate) };

    if (type === "occasion") {
      updateOccasion.mutate({ id, updates: updated });
    } else if (type === "birthday") {
      editBirthday(id, updated);
    }

    setIsEditing(false);
    onEditComplete?.();
  };

  const handleDelete = () => {
    if (type === "occasion") {
      deleteOccasion.mutate(id);
    } else if (type === "birthday") {
      deleteBirthday(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(title);
    setNewDate(rawDate.toISOString().split("T")[0]);
    onEditComplete?.();
  };

  const cardClasses = cn(
    "group/card relative w-full p-2 rounded-xl text-sm space-y-2 text-center",
    "text-mid-gray first:text-primary"
  );

  const dateClasses = "text-light-gray text-center";

  const ActionButtons = () => (
    <div className="opacity-0 group-hover/card:opacity-100 bg-white flex items-center gap-x-1 px-2">
      <Pencil
        onClick={() => setIsEditing(true)}
        className="transition-opacity size-4 text-gray-400 hover:text-primary cursor-pointer"
      />
      <Trash
        onClick={handleDelete}
        className="transition-opacity size-4 text-gray-400 hover:text-destructive cursor-pointer"
      />
    </div>
  );

  const EditButtons = () => (
    <>
      <Check
        className="size-4 text-success cursor-pointer"
        onClick={handleSave}
      />
      <X
        className="size-4 text-gray-400 hover:text-destructive cursor-pointer"
        onClick={handleCancel}
      />
    </>
  );

  return (
    <div className={cardClasses}>
      {isEditing ? (
        <div className="space-y-2">
          <Input
            ref={titleInputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-sm"
            placeholder="Title"
          />
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="text-sm"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleCancel}
              className="p-1.5 rounded hover:bg-gray-100"
            >
              <X className="size-4 text-gray-400 hover:text-destructive" />
            </button>
            <button
              onClick={handleSave}
              className="p-1.5 rounded hover:bg-gray-100"
            >
              <Check className="size-4 text-success" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center gap-2",
            !isRTL && "flex-row-reverse"
          )}
        >
          {/* Action buttons - Start side in RTL, End side in LTR */}
          {type === "birthday" ? null : (
            <div
              className={cn(
                "absolute flex gap-1 inset-y-0 items-center",
                !isRTL ? "right-2" : "left-2"
              )}
            >
              <ActionButtons />
            </div>
          )}

          {/* Content */}
          <div
            className={cn(
              "flex flex-col items-center flex-1 mx-2 overflow-hidden"
            )}
          >
            <p className="font-medium overflow-hidden text-ellipsis truncate">
              {title}
            </p>
            <p className={dateClasses}>{date}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
