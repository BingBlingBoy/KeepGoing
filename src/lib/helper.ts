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
