import { findAvailableMeeting } from "../src/index";

describe("findAvailableMeeting", () => {
  it('should return "1 08:00-08:59" cause nothings is scheduled', () => {
    const schedule: string[] = [];
    const result = findAvailableMeeting(schedule, 1);

    expect(result).toHaveLength(1);
    expect(result).toStrictEqual(["1 08:00-08:59"]);
  });

  it("should find available slots but we chosed to have only one of them", () => {
    const schedule: string[] = ["1 08:45-12:59"];
    const result = findAvailableMeeting(schedule, 1);
    expect(result).toHaveLength(1);
    expect(result).toStrictEqual(["1 13:00-13:59"]);
  });

  it("should handle multiple meetings across workdays", () => {
    const schedule: string[] = [
      "1 08:45-16:59",
      "2 08:45-16:59",
      "3 11:09-11:28",
      "5 09:26-09:56",
      "5 16:15-16:34",
      "3 08:40-10:12",
    ];
    const result = findAvailableMeeting(schedule, 1);
    expect(result).toHaveLength(1);
    expect(result).toStrictEqual(["3 11:29-12:28"]);
  });

  it("should find max 50 slots of meetings", () => {
    const schedule: string[] = [];
    const result = findAvailableMeeting(schedule, 50); // Meeting duration of 120 minutes
    expect(result).toHaveLength(50);
  });

  it("should find max 5 slots of meetings starting every 15min", () => {
    const schedule: string[] = [
      "5 08:00-17:59",
      "1 08:00-17:59",
      "3 08:00-17:59",
      "2 9:30-17:59",
      "4 9:30-17:59",
    ];
    const result = findAvailableMeeting(schedule, 5, 15);
    expect(result).toEqual([
      "2 08:00-08:59",
      "2 08:15-09:14",
      "2 08:30-09:29",
      "4 08:00-08:59",
      "4 08:15-09:14",
    ]);
  });
});
