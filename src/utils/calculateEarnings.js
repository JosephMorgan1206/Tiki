export default function calculateEarnings(tokens, volume, days, earningSupply, bnbPrice) {
  const dayEarnings = (volume * 0.11 * (tokens / earningSupply)) / bnbPrice;
  return dayEarnings * days;
}
