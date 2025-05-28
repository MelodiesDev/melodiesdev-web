import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
import { ReactNode, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
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
            background: 'rgba(20,20,20,0.95)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: 'calc(0.5rem - 1px)',
            borderRadius: '6px',
            marginRight: '5px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" style={{ color: 'white' }} />
          {selectedDate ? format(selectedDate, "PPP") : <span style={{ color: '#aaa' }}>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-md border border-white/20" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          initialFocus
          className="bg-transparent text-white"
        />
      </PopoverContent>
    </Popover>
  );
}

interface ManualLocation {
  latitude: number;
  longitude: number;
}

interface DateTimeLocationPickerProps {
  onDateTimeChangeAction: (date: Date) => void;
  manualLocation?: ManualLocation;
  onLocationChangeAction?: (location: ManualLocation) => void;
}

const commonInputStyles = {
  color: 'white',
  background: 'rgba(20,20,20,0.95)',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: 'calc(0.5rem - 1px)',
  borderRadius: '6px',
  height: 'calc(1.5rem + 2px + 2* (0.5rem - 1px))',
  marginLeft: '5px',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
};

export function DateTimeLocationPicker({ onDateTimeChangeAction, manualLocation, onLocationChangeAction }: DateTimeLocationPickerProps): ReactNode {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeInput, setTimeInput] = useState<string>("");
  const [latitudeInput, setLatitudeInput] = useState<string>("0");
  const [longitudeInput, setLongitudeInput] = useState<string>("0");
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const now = dayjs();
    const currentHours = now.hour().toString().padStart(2, '0');
    const currentMinutes = now.minute().toString().padStart(2, '0');
    setTimeInput(`${currentHours}:${currentMinutes}`);

    if (!manualLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lon = position.coords.longitude.toFixed(6);
          setLatitudeInput(lat);
          setLongitudeInput(lon);
          if (onLocationChangeAction) {
            onLocationChangeAction({
              latitude: parseFloat(lat),
              longitude: parseFloat(lon)
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (manualLocation && !isUserEditing) {
      setLatitudeInput(manualLocation.latitude.toFixed(6));
      setLongitudeInput(manualLocation.longitude.toFixed(6));
    }
  }, [manualLocation, isUserEditing]);

  useEffect(() => {
    if (selectedDate && timeInput) {
      const [hours, minutes] = timeInput.split(':').map(Number);
      const localDateTime = dayjs(selectedDate)
        .hour(hours)
        .minute(minutes)
        .second(0)
        .millisecond(0);
      const newOverrideDateUTC = localDateTime.utc().toDate();
      onDateTimeChangeAction(newOverrideDateUTC);
    } else {
      onDateTimeChangeAction(new Date());
    }
  }, [selectedDate, timeInput, onDateTimeChangeAction]);

  const debouncedLocationChange = useCallback(
    debounce((lat: number, lon: number) => {
      if (onLocationChangeAction && isFinite(lat) && isFinite(lon)) {
        onLocationChangeAction({ latitude: lat, longitude: lon });
      }
    }, 300),
    [onLocationChangeAction]
  );

  const handleCoordinateChange = (value: string, isLatitude: boolean) => {
    setIsUserEditing(true);
    if (isLatitude) {
      setLatitudeInput(value);
    } else {
      setLongitudeInput(value);
    }

    const lat = parseFloat(isLatitude ? value : latitudeInput);
    const lon = parseFloat(isLatitude ? longitudeInput : value);

    if (isFinite(lat) && isFinite(lon)) {
      debouncedLocationChange(lat, lon);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'rgba(20,20,20,0.95)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '6px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </Button>

      <div style={{
        display: isExpanded ? 'flex' : 'none',
        background: 'rgba(20,20,20,0.8)',
        padding: '10px',
        borderRadius: '8px',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <DatePickerInDateTimePicker
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        <input
          type="time"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          style={commonInputStyles}
        />
        <input
          type="number"
          value={latitudeInput}
          onChange={(e) => handleCoordinateChange(e.target.value, true)}
          onBlur={() => setIsUserEditing(false)}
          placeholder="Latitude"
          step="any"
          style={{ ...commonInputStyles, width: '100px' }}
        />
        <input
          type="number"
          value={longitudeInput}
          onChange={(e) => handleCoordinateChange(e.target.value, false)}
          onBlur={() => setIsUserEditing(false)}
          placeholder="Longitude"
          step="any"
          style={{ ...commonInputStyles, width: '100px' }}
        />
      </div>
    </div>
  );
} 