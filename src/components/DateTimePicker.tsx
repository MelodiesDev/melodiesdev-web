"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc';
import { ReactNode, useEffect, useState } from "react";
dayjs.extend(utc);

interface DatePickerForDateTimePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  className?: string;
}

function DatePickerInDateTimePicker({ selectedDate, onDateSelect, className }: DatePickerForDateTimePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
          style={{
            color: 'white',
            background: 'rgba(50,50,50,0.8)',
            border: '1px solid #ccc',
            padding: 'calc(0.5rem - 1px)',
            borderRadius: '3px',
            marginRight: '5px'
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" style={{ color: 'white' }} />
          {selectedDate ? format(selectedDate, "PPP") : <span style={{ color: '#aaa' }}>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          initialFocus
          className="bg-white text-black"
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateTimePickerProps {
  onDateTimeChangeAction: (date: Date) => void;
}

export function DateTimePicker({ onDateTimeChangeAction }: DateTimePickerProps): ReactNode {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeInput, setTimeInput] = useState<string>("");

  useEffect(() => {
    // Initialize time input to current time
    const now = dayjs();
    const currentHours = now.hour().toString().padStart(2, '0');
    const currentMinutes = now.minute().toString().padStart(2, '0');
    setTimeInput(`${currentHours}:${currentMinutes}`);
    // selectedDate is already initialized to new Date()
  }, []);

  useEffect(() => {
    if (selectedDate && timeInput) {
      const [hours, minutes] = timeInput.split(':').map(Number);
      
      const localDateTime = dayjs(selectedDate)
        .hour(hours)
        .minute(minutes)
        .second(0)
        .millisecond(0);
      
      // Revert to instance method, assuming ESM import for plugin helps with types
      const newOverrideDateUTC = localDateTime.utc().toDate(); 
      onDateTimeChangeAction(newOverrideDateUTC);
    } else {
      onDateTimeChangeAction(new Date());
    }
  }, [selectedDate, timeInput, onDateTimeChangeAction]);

  return (
    <div style={{
      position: 'fixed', // Use fixed to ensure it's relative to viewport
      top: '10px',
      left: '10px',
      zIndex: 99999, // Very high z-index
      background: 'rgba(0,0,0,0.5)',
      padding: '10px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <DatePickerInDateTimePicker
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      <input
        type="time"
        value={timeInput}
        onChange={(e) => setTimeInput(e.target.value)}
        style={{
          color: 'white',
          background: 'rgba(50,50,50,0.8)',
          border: '1px solid #ccc',
          padding: 'calc(0.5rem - 1px)',
          borderRadius: '3px',
          height: 'calc(1.5rem + 2px + 2* (0.5rem - 1px))',
          marginLeft: '5px'
        }}
      />
    </div>
  );
} 