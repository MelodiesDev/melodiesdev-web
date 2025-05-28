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
          className={cn(
            "h-9 w-[220px] justify-start align-middle items-center flex bg-black/90 backdrop-blur-md border border-white/20 text-left font-normal",
            !selectedDate && "text-white",
            className
          )}
        >
          <div className="flex flex-row items-center">
            <CalendarIcon className="mr-2 h-4 w-4" style={{ color: 'white' }} />
            {selectedDate ? format(selectedDate, "PPP") : <span style={{ color: '#aaa' }}>Pick a date</span>}
          </div>
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
        () => {
          // Silently default to 0,0 if geolocation fails
          setLatitudeInput("0");
          setLongitudeInput("0");
          if (onLocationChangeAction) {
            onLocationChangeAction({
              latitude: 0,
              longitude: 0
            });
          }
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
    <div className="absolute text-white mt-4 ml-4 flex flex-row z-50 items-stretch h-12">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? "Collapse date, time and location picker" : "Expand date, time and location picker"}
        className="w-10 h-10 my-auto bg-black/90 backdrop-blur-md border border-white/20 flex items-center justify-center drop-shadow-2xl text-white cursor-pointer transition-all duration-200"
      >
        {isExpanded ? <ChevronLeft/> : <ChevronRight />}
      </Button>

      <div 
        className={cn(
          "drop-shadow-2xl bg-black/90 backdrop-blur-md border border-white/20 rounded-md ml-2 transition-all duration-200 ease-in-out overflow-hidden h-12",
          isExpanded ? "max-w-[900px] opacity-100" : "max-w-0 opacity-0 border-0"
        )}
      >
        <div className="flex flex-row items-center h-full gap-5 px-3 whitespace-nowrap">
          <DatePickerInDateTimePicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <input
            className="drop-shadow-2xl hover:bg-primary/90 w-[140px] px-3 h-9 bg-black/90 backdrop-blur-md border border-white/20 items-center inline-block rounded-md"
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
          />
          <input
            type="number"
            className="drop-shadow-2xl hover:bg-primary/90 w-[140px] px-3 h-9 bg-black/90 backdrop-blur-md border border-white/20 items-center inline-block rounded-md"
            value={latitudeInput}
            onChange={(e) => handleCoordinateChange(e.target.value, true)}
            onBlur={() => setIsUserEditing(false)}
            placeholder="Latitude"
            step="any"
          />
          <input
            className="drop-shadow-2xl hover:bg-primary/90 w-[140px] px-3 h-9 bg-black/90 backdrop-blur-md border border-white/20 items-center inline-block rounded-md"
            type="number"
            value={longitudeInput}
            onChange={(e) => handleCoordinateChange(e.target.value, false)}
            onBlur={() => setIsUserEditing(false)}
            placeholder="Longitude"
            step="any"
          />
        </div>
      </div>
    </div>
  );
} 