"use client";

import EmptyState from "@/components/common/EmptyState";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Gift,
  CheckSquare,
} from "lucide-react";

export default function EmptyStateTestClient() {
  const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg">("md");
  const [showActions, setShowActions] = useState(true);

  const emptyStateExamples = [
    {
      title: "Bookings Empty State",
      description: "No bookings yet",
      icon: Calendar,
      image: undefined,
      primaryAction: showActions
        ? {
            label: "Make a Booking",
            onClick: () => alert("Make a booking clicked!"),
          }
        : undefined,
      secondaryAction: showActions
        ? {
            label: "Learn More",
            onClick: () => alert("Learn more clicked!"),
          }
        : undefined,
    },
    {
      title: "Children Empty State",
      description: "No children added",
      icon: Users,
      image: undefined,
      primaryAction: showActions
        ? {
            label: "Add Child",
            onClick: () => alert("Add child clicked!"),
          }
        : undefined,
    },
    {
      title: "Chat Empty State",
      description: "No conversations yet",
      icon: MessageSquare,
      image: undefined,
      primaryAction: showActions
        ? {
            label: "Start Chat",
            onClick: () => alert("Start chat clicked!"),
          }
        : undefined,
    },
    {
      title: "Reports Empty State",
      description: "No reports available",
      icon: FileText,
      image: undefined,
    },
    {
      title: "Birthdays Empty State",
      description: "No upcoming birthdays",
      icon: Gift,
      image: undefined,
    },
    {
      title: "Tasks Empty State",
      description: "No tasks yet",
      icon: CheckSquare,
      image: undefined,
      primaryAction: showActions
        ? {
            label: "Add Task",
            onClick: () => alert("Add task clicked!"),
          }
        : undefined,
    },
    {
      title: "Custom Image Empty State",
      description: "Using custom image instead of icon",
      icon: undefined,
      image: "/assets/illustrations/empty.png",
      primaryAction: showActions
        ? {
            label: "Get Started",
            onClick: () => alert("Get started clicked!"),
          }
        : undefined,
    },
    {
      title: "Emoji Icon Empty State",
      description: "Using emoji as icon",
      icon: "🎉",
      image: undefined,
      primaryAction: showActions
        ? {
            label: "Celebrate",
            onClick: () => alert("Celebrate clicked!"),
          }
        : undefined,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Empty State Component Test
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This page demonstrates the different variations of the EmptyState
          component that can be used across the dashboard when there's no data
          to display.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) =>
                setSelectedSize(e.target.value as "sm" | "md" | "lg")
              }
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showActions"
              checked={showActions}
              onChange={(e) => setShowActions(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showActions" className="text-sm font-medium">
              Show Actions
            </label>
          </div>
        </div>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emptyStateExamples.map((example, index) => (
          <Card key={index} className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">{example.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                title={example.description}
                description="This is a sample description for the empty state component."
                icon={example.icon}
                image={example.image}
                primaryAction={example.primaryAction}
                secondaryAction={example.secondaryAction}
                size={selectedSize}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Basic Usage:</h4>
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
              {`<EmptyState
  title="No data available"
  description="There's nothing to show here yet."
  icon={Calendar}
  size="md"
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">With Actions:</h4>
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
              {`<EmptyState
  title="No bookings yet"
  description="Your booking history will appear here."
  icon="📅"
  size="lg"
  primaryAction={{
    label: "Make a Booking",
    onClick: () => handleBooking()
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: () => showHelp()
  }}
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">With Custom Image:</h4>
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
              {`<EmptyState
  title="No data available"
  description="Get started by adding some content."
  image="/assets/illustrations/empty.png"
  size="md"
  primaryAction={{
    label: "Get Started",
    onClick: () => startAction()
  }}
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
