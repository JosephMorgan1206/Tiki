export default function TimeDifference(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;
  let result;
  if (elapsed < msPerMinute) {
    const secs = Math.round(elapsed / 1000);
    result = secs > 1 ? `${secs} Seconds Ago` : `${secs} Second Ago`;
  } else if (elapsed < msPerHour) {
    const mins = Math.round(elapsed / msPerMinute);
    result = mins > 1 ? `${mins} Minutes Ago` : `${mins} Minute Ago`;
  } else if (elapsed < msPerDay) {
    const hours = Math.round(elapsed / msPerHour);
    result = hours > 1 ? `${hours} Hours Ago` : `${hours} Hour Ago`;
  } else if (elapsed < msPerMonth) {
    result = `~ ${Math.round(elapsed / msPerDay)} days Ago`;
  } else if (elapsed < msPerYear) {
    result = `~ ${Math.round(elapsed / msPerMonth)} months Ago`;
  } else {
    result = `~ ${Math.round(elapsed / msPerYear)} years Ago`;
  }

  return result;
}
