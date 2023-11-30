import fetch from 'node-fetch'

export const handler = async (event) => {
    const type = event.queryStringParameters.type ?? 'tv'
    const IMAGEPATH = 'https://image.tmdb.org/t/p/w780'
    const TMDB_PATH = `http://api.themoviedb.org/3/search/${type}?query=${event.queryStringParameters.search}`


    const response = await fetch(TMDB_PATH, {
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`,
            'accept': 'application/json'
        }
    })
    const data = await response.json()

    return {
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: JSON.stringify(data.results.map(r => {
            let title = r.title
            let year = r.release_date ? new Date(r.release_date).getFullYear() : null
            if (type === 'tv')
            {
                title = r.name
                year = r.first_air_date ? new Date(r.first_air_date).getFullYear() : null
            }
            return {
                id: r.id,
                title,
                year,
                poster: r.poster_path ? `${IMAGEPATH}${r.poster_path}` : null,
                backdrop: r.backdrop_path ? `${IMAGEPATH}${r.backdrop_path}` : null,
                link: `https://www.themoviedb.org/${type}/${r.id}`,
            }
        }))
    }
}
