export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day} ${month}, ${year} - ${hours}:${minutes}`;
}
