"use client";

import { useState, useEffect } from "react";
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
};

const Card = ({ id, type, title, date, rawDate }: CardProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDate, setNewDate] = useState(rawDate.toISOString().split("T")[0]);

  // Auto-enter edit mode if title is empty
  useEffect(() => {
    if (!title && type === "occasion") {
      setIsEditing(true);
    }
  }, [title, type]);

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
  };

  const handleDelete = () => {
    if (type === "occasion") {
      deleteOccasion.mutate(id);
    } else if (type === "birthday") {
      deleteBirthday(id);
    }
  };

  const cardClasses = cn(
    "group relative w-full p-2 rounded-xl text-sm space-y-2 text-center",
    "text-mid-gray first:text-primary"
  );

  const dateClasses = "text-light-gray text-center";

  const ActionButtons = () => (
    <div className="bg-white flex items-center gap-x-1 px-2">
      <Pencil
        onClick={() => setIsEditing(true)}
        className="hidden group-hover:block size-4 text-gray-400 hover:text-primary cursor-pointer"
      />
      <Trash
        onClick={handleDelete}
        className="hidden group-hover:block size-4 text-gray-400 hover:text-destructive cursor-pointer"
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
        onClick={() => {
          setIsEditing(false);
          setNewTitle(title);
          setNewDate(rawDate.toISOString().split("T")[0]);
        }}
      />
    </>
  );

  return (
    <div className={cardClasses}>
      <div
        className={cn("flex items-center gap-2", !isRTL && "flex-row-reverse")}
      >
        {/* Action buttons - Start side in RTL, End side in LTR */}
        {type === 'birthday' ? null: (
          <div
          className={cn(
            "absolute flex gap-1 inset-y-0 items-center",
            !isRTL ? "right-2" : "left-2"
          )}
        >
          {isEditing ? <EditButtons /> : <ActionButtons />}
        </div>
        )}

        {/* Content */}
        {isEditing ? (
          <div className="flex-1 mx-8">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-sm mb-1"
            />
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="text-sm"
            />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Card;
