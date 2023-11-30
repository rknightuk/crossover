const fs = require('fs')


const formatted = {}

Object.keys(shows).forEach(s => {
    const show = shows[s]

    formatted[s] = {
        showData: {
            id: s,
            name: show.showData.name,
            backdrop: `https://image.tmdb.org/t/p/w780${show.showData.backdrop_path}`,
            link: show.showData.link,
            number_of_episodes: show.showData.number_of_episodes,
            number_of_seasons: show.showData.number_of_seasons,
        },
        actors: {},
    }

    Object.keys(show.actors).forEach(a => {
        const actor = show.actors[a]
        formatted[s].actors[a] = {
            id: actor.id,
            name: actor.name,
            photo: `https://image.tmdb.org/t/p/w200${actor.profile_path}`,
            role: {
                character: actor.roles[0].character,
                episode_count: actor.roles[0].episode_count,
            },
        }
    })
})

console.log(formatted)

fs.writeFileSync('./formatted.json', JSON.stringify(formatted))