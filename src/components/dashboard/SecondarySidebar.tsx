"use client";

import { useLocale, useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Header from "./secondary-sidebar/Header";
import TaskCard from "./secondary-sidebar/TaskCard";
import Card from "./secondary-sidebar/Card";
import EmptyState from "./secondary-sidebar/EmptyState";
import { Task, useTasks } from "@/hooks/useTasks";
import { useOccasions, Occasion } from "@/hooks/useOccasions";
import { useBirthdays, Birthday } from "@/hooks/useBirthdays";

const SecondarySidebar = () => {
  const locale = useLocale();
  const t = useTranslations("dashboard.secondary-sidebar");

  const {
    occasions,
    isLoading: occasionsLoading,
    error: occasionsError,
    addOccasion,
  } = useOccasions();
  const {
    birthdays,
    isLoading: birthdaysLoading,
    error: birthdaysError,
  } = useBirthdays();
  const { tasks, isLoading, error, addTask } = useTasks();

  return (
    <Sidebar
      className="bg-sidebar h-screen py-10 px-4"
      side={locale === "ar" ? "left" : "right"}
      collapsible="offcanvas"
    >
      <SidebarHeader className="mb-9 px-0">
        <Header />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl text-primary">
              {t("upcoming-occasions")}
            </p>
            <PlusCircle
              onClick={() =>
                addOccasion.mutate({
                  title: t("add.occasion"),
                  date: new Date(),
                })
              }
              className="size-4 text-light-gray hover:text-primary cursor-pointer"
            />
          </div>

          {occasionsLoading ? (
            <div className="mt-4 text-center text-light-gray">
              {t("loading")}
            </div>
          ) : occasionsError ? (
            <div className="mt-4 text-center text-error">
              {occasionsError instanceof Error
                ? occasionsError.message
                : "An error occurred"}
            </div>
          ) : occasions.length === 0 ? (
            <EmptyState
              onAdd={() =>
                addOccasion.mutate({
                  title: t("add.occasion"),
                  date: new Date(),
                })
              }
            />
          ) : (
            <div className="mt-2 flex flex-col items-center gap-y-2">
              {occasions.map((item: Occasion) => (
                <Card
                  key={item.id}
                  id={item.id}
                  type="occasion"
                  title={item.title}
                  rawDate={item.date}
                  date={item.date.toLocaleDateString(locale, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                />
              ))}
              <div className="w-4/5 h-px bg-light-gray rounded-full" />
            </div>
          )}
        </SidebarGroup>

        <SidebarGroup className="px-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl text-primary">{t("birthdays")}</p>
          </div>

          {birthdaysLoading ? (
            <div className="mt-4 text-center text-light-gray">
              {t("loading")}
            </div>
          ) : birthdaysError ? (
            <div className="mt-4 text-center text-error">
              {birthdaysError instanceof Error
                ? birthdaysError.message
                : "An error occurred"}
            </div>
          ) : birthdays.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-2 flex flex-col items-center gap-y-2">
              {birthdays.map((item: Birthday) => (
                <Card
                  key={item.id}
                  id={item.id}
                  type="birthday"
                  title={item.title}
                  rawDate={item.date}
                  date={item.date.toLocaleDateString(locale, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                />
              ))}
              <div className="w-4/5 h-px bg-light-gray rounded-full" />
            </div>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl text-primary">{t("tasks")}</p>

            <div className="flex items-center gap-x-2">
              <p className="text-xs text-success">
                {t("tasks-progress", {
                  completed: tasks.filter((t: Task) => t.done).length,
                  total: tasks.length,
                })}
              </p>
              <PlusCircle
                onClick={() =>
                  addTask.mutate({
                    title: t("add.task"),
                    date: new Date(),
                    done: false,
                  })
                }
                className="size-4 text-light-gray hover:text-primary cursor-pointer"
              />
            </div>
          </div>

          {isLoading && tasks.length === 0 ? (
            <div className="mt-4 text-center text-light-gray">
              {t("loading")}
            </div>
          ) : error ? (
            <div className="mt-4 text-center text-error">
              {error instanceof Error ? error.message : "An error occurred"}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              onAdd={() =>
                addTask.mutate({
                  title: t("add.task"),
                  date: new Date(),
                  done: false,
                })
              }
            />
          ) : (
            <div className="mt-2 flex flex-col gap-y-2">
              {/* Tasks list */}
              <div className="flex flex-col items-center gap-y-2">
                {tasks.map((item: Task) => (
                  <TaskCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    rawDate={item.date}
                    date={item.date.toLocaleDateString(locale, {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                    done={item.done}
                  />
                ))}
                <div className="w-4/5 h-px bg-light-gray rounded-full mt-1" />
              </div>
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SecondarySidebar;
