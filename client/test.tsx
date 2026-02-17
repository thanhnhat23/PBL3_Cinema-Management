"use client";
import {
  Card,
  Skeleton,
  TimeInput, 
  Pagination,
  InputOtp,
  DateRangePicker,
  DatePicker,
  Button,
  addToast,
  Textarea,
} from "@heroui/react";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <DatePicker className="max-w-71" label="Birth date" />

      <DateRangePicker
        isRequired
        className="max-w-xs"
        label="Start movie"
      />

      <InputOtp length={6} value={value} onValueChange={setValue} />
      <div className="text-small text-default-500">
        OTP value: <span className="text-md font-medium">{value}</span>
      </div>

      <Pagination initialPage={1} total={10} />

      <Card className="w-50 space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>

      {(["default", "primary", "secondary", "success", "warning", "danger"] as const).map((color) => (
        <Button
          key={color}
          color={color}
          variant={"flat"}
          onPress={() => {
            addToast({
              title: "Toast title",
              description: "Toast displayed successfully",
              color: color,
            })
          }}
        >
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </Button>
      ))}

      <Textarea className="max-w-xs font-bold" label="Description" placeholder="Enter your review" />

      <div className="flex items-center gap-2">
        <TimeInput isRequired className="w-22" label="Start Time" />
        -
        <TimeInput isRequired className="w-22" label="End Time" />
      </div>
    </div>
  )
}
