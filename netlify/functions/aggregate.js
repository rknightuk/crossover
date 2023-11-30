import fetch from 'node-fetch'

export const handler = async (event) => {
    const showId = event.queryStringParameters.showId
    const IMAGEPATH = 'https://image.tmdb.org/t/p/w780'
    const TMDB_PATH = `https://api.themoviedb.org/3/tv/${showId}/aggregate_credits?language=en-US`


    const response = await fetch(TMDB_PATH, {
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`,
            'accept': 'application/json'
        }
    })
    const actorJson = await response.json()
    const data = {}

    actorJson.cast.forEach((actor) => {
        if (actor.known_for_department !== 'Acting') return
        data[actor.id] = {
            id: actor.id,
            name: actor.name,
            photo: `https://image.tmdb.org/t/p/w200${actor.profile_path}`,
            role: {
                character: actor.roles[0].character,
                episode_count: actor.roles[0].episode_count,
            },
        }
    })

    const episodes = await fetch(`https://api.themoviedb.org/3/tv/${showId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`,
            'accept': 'application/json'
        }
    })

    const showJson = await episodes.json()

    return {
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: JSON.stringify({
            [showId]: {
                actors: data,
                showData: {
                    id: showJson.id,
                    name: showJson.name,
                    backdrop: showJson.backdrop_path ? `${IMAGEPATH}${showJson.backdrop_path}` : null,
                    link: `https://www.themoviedb.org/tv/${showJson.id}`,
                    number_of_episodes: showJson.number_of_episodes,
                    number_of_seasons: showJson.number_of_seasons,
                },
            }
        })
    }
}
