"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { Pencil, Trash, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";

type TaskCardProps = {
  id: string;
  title: string;
  date: string;
  rawDate: Date;
  done: boolean;
  isNew?: boolean;
  onEditComplete?: () => void;
};

const TaskCard = ({
  id,
  title,
  date,
  rawDate,
  done = false,
  isNew = false,
  onEditComplete,
}: TaskCardProps) => {
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

  const { updateTask, deleteTask, toggleTaskDone } = useTasks();

  const handleSave = () => {
    updateTask.mutate(
      {
        id,
        updates: {
          title: newTitle,
          date: new Date(newDate),
          done,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          onEditComplete?.();
        },
      }
    );
  };

  const cardClasses = cn(
    "group/task relative w-full p-2 pt-2.5 pb-2.5 rounded-xl text-sm bg-white",
    done ? "text-success" : "text-warning"
  );

  const ActionButtons = () => (
    <div className="opacity-0 group-hover/task:opacity-100 bg-white flex items-center gap-x-1 px-2">
      <Pencil
        onClick={() => setIsEditing(true)}
        className="transition-opacity size-4 text-gray-400 hover:text-primary cursor-pointer"
      />
      <Trash
        onClick={() => deleteTask.mutate(id)}
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
        onClick={() => {
          setIsEditing(false);
          setNewTitle(title);
          setNewDate(rawDate.toISOString().split("T")[0]);
          onEditComplete?.();
        }}
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
            placeholder="Task title"
          />
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="text-sm"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                setIsEditing(false);
                setNewTitle(title);
                setNewDate(rawDate.toISOString().split("T")[0]);
                onEditComplete?.();
              }}
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
          <div
            className={cn(
              "absolute flex gap-1 inset-y-0 items-center",
              !isRTL ? "right-2" : "left-2"
            )}
          >
            <ActionButtons />
          </div>

          {/* Content */}
          <div
            className={cn(
              "flex justify-between items-center flex-1 mx-2 overflow-hidden",
              isRTL ? "mr-8" : "ml-8"
            )}
          >
            <p
              className={cn(
                "font-medium overflow-hidden text-ellipsis truncate",
                done ? "text-success" : "text-warning"
              )}
            >
              {title}
            </p>
            <p
              className={cn("text-xs", done ? "text-success" : "text-warning")}
            >
              {date}
            </p>
          </div>

          {/* Checkbox - End side in RTL, Start side in LTR */}
          <div
            className={cn(
              "absolute inset-y-0 flex items-center",
              !isRTL ? "left-2" : "right-2"
            )}
          >
            <Checkbox
              checked={Boolean(done)}
              onCheckedChange={() => toggleTaskDone.mutate({ id, done: !done })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
