export async function generateTopic(){

  const res = await fetch("https://trends.google.com/trends/api/dailytrends")

  const data = await res.json()

  return data.trendingSearchesDays[0]
}