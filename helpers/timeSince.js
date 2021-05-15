export function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  function numberEnding(number) {
    return number > 1 ? "s" : "";
  }

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " year" + numberEnding(interval);
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " month" + numberEnding(interval);
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " day" + numberEnding(interval);
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hour" + numberEnding(interval);
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minute" + numberEnding(interval);
  }

  return Math.floor(seconds) + " second" + numberEnding(Math.floor(seconds));
}

export function timeSinceFromTimestamp(timestamp) {
  return timeSince(new Date(timestamp).getTime());
}
