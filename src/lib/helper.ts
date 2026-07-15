import type { HeatMapEntry } from "../types";

export function formatCustomDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const getOrdinalSuffix = (n: number) => {
    if (n >= 11 && n <= 13) return "th";

    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${weekday} ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

export function generateRealistic(year: number) {
  const data = []
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)

  for (const d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const yearStr = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const dateString = `${yearStr}/${month}/${day}`

    const dayOfWeek = d.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isVacation = d.getMonth() === 7 && d.getDate() > 10 && d.getDate() < 24;
    const chanceOfActivity = isWeekend ? 0.3 : 0.85;

    if (Math.random() < chanceOfActivity && !isVacation) {
      let count = Math.floor(Math.random() * 3) + 1;

      if (Math.random() > 0.9) {
        count += Math.floor(Math.random() * 8) + 3
      }

      data.push({ date: dateString, count })
    }

  }

  return data
}

export function calcAverage(data: HeatMapEntry[]) {
  if (!data.length) return 0;

  const countTotal = data.reduce((sum, entry) => sum + entry.count, 0);

  return (countTotal / data.length)
}

export function calcStdDev(data: HeatMapEntry[]) {
  if (!data.length) return 0;

  const mean = calcAverage(data);
  const numerator = data.reduce((sum, entry) => { return sum + ((entry.count - mean) ** 2) }, 0)
  const denominator = data.length

  return Math.sqrt(numerator / denominator)
}

export function calcTotal(data: HeatMapEntry[]) {
  if (!data.length) return 0;

  const countTotal = data.reduce((sum, entry) => sum + entry.count, 0);

  return countTotal;
}
