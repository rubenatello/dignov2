// Utility for calculating the next 6AM ET (New York)
export function getNext6amET(): string {
  const now = new Date();
  // Get current time in New York (ET)
  const nowNY = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  let next6am = new Date(nowNY);
  next6am.setHours(6, 0, 0, 0);
  if (nowNY.getHours() >= 6) {
    // If after 6am, schedule for next day
    next6am.setDate(next6am.getDate() + 1);
  }
  // Convert next6am (NY) to UTC string for backend
  const next6amUtc = new Date(next6am.toLocaleString('en-US', { timeZone: 'UTC' }));
  // Format as yyyy-MM-ddTHH:mm (for input type="datetime-local")
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dt = next6amUtc;
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}
