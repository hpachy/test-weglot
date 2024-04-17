interface TimeInterval {
  day: number;
  start: number;
  end: number;
}

// Find the first interval for a meeting of 59min
export function findAvailableMeeting(
  schedule: string[],
  numberOfSlots: number,
  everyInterval: number = 1
): string[] {
  const busyTimes: TimeInterval[] = [];
  const result: string[] = [];

  // Convert unavailable time slots into TimeInterval
  for (const slot of schedule) {
    const [day, interval] = slot.split(" ");
    const [start, end] = interval.split("-");
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    busyTimes.push({
      day: parseInt(day),
      start: startHour * 60 + startMinute,
      end: endHour * 60 + endMinute,
    });
  }

  // Convert working hours into TimeInterval
  const workHours: TimeInterval[] = [];
  for (let day = 1; day <= 5; day++) {
    workHours.push({
      day,
      start: 8 * 60,
      end: 17 * 60 - 1,
    });
  }

  // Traverse working hours to find an available time slot.
  workHours.forEach((workSlot) => {
    for (
      let minute = workSlot.start;
      minute <= workSlot.end - 59;
      minute += everyInterval
    ) {
      const meetingEnd = minute + 59;

      // Check the working hours with the busyTimes
      const isAvailable = busyTimes.every(
        (busySlot) =>
          busySlot.day !== workSlot.day ||
          meetingEnd <= busySlot.start ||
          minute > busySlot.end
      );
      // Can chose how many slots you want based on the chronologically ordered availability
      if (isAvailable && numberOfSlots > result.length) {
        const [startHour, startMinute] = convertToHourMinute(minute);
        const [endHour, endMinute] = convertToHourMinute(meetingEnd);
        result.push(
          `${workSlot.day} ${customFormatTime(
            startHour,
            startMinute
          )}-${customFormatTime(endHour, endMinute)}`
        );
      }
    }
  });

  return result;
}

function convertToHourMinute(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return [hour, minute];
}

function customFormatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}
