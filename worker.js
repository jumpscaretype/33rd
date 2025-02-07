addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json'
  }

  const API_KEY = YOUTUBE_API_KEY;
  
  const REGIONS = {
    'US': 'United States',
    'JP': 'Japan',
    'KR': 'South Korea',
    'BR': 'Brazil',
    'GB': 'United Kingdom',
    'FR': 'France'
  }

  try {
    const results = {}
    
    for (const [code, name] of Object.entries(REGIONS)) {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&regionCode=${code}&key=${API_KEY}`
      )
      
      if (!response.ok) {
        throw new Error(`YouTube API error for ${code}`)
      }

      const data = await response.json()
      
      if (data.items && data.items.length >= 33) {
        const video = data.items[32]
        results[code] = {
          id: video.id,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          views: video.statistics.viewCount,
          likes: video.statistics.likeCount,
          region: name
        }
      }
    }

    return new Response(JSON.stringify(results), {
      headers: corsHeaders
    })

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch YouTube data',
      details: error.message
    }), {
      headers: corsHeaders,
      status: 500
    })
  }
}
