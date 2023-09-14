const { ACAR, CustomStatus, RichPresence, SpotifyRPC } = require('./Classes/Client');
const Settings = require('./settings.json');
const Spotify = require('./Spotify/Data.json');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

let obj = {
    selfMute: false,
    selfDeaf: false,
}

for (let index = 0; index < Settings["tokens"].length; index++) {
    const token = Settings["tokens"][index];
    let channel = Settings["channels"][index];
    if(!channel) channel = Settings["channels"][0]
    const client = new ACAR();
    client.login(token)
    .catch(async (err) => {
        const dirDatabase = new FileSync(`./settings.json`);
        const Database = low(dirDatabase)
        let filtered = Settings.tokens.filter(x => x != token) || []
        
        console.log(`${index + 1}. Satırda ki token arızalı olduğundan kaldırıldı.`)

    })

    client.on('ready', async () => {
    
        const dirDatabase = new FileSync(`./Databases/${client.user.id}.json`);
        const Database = low(dirDatabase)
        let get_channel = await Database.get("channel").value();
        let find =  client.channels.cache.get(get_channel) || client.channels.cache.get(channel);
        if(!find) return console.log(`[${client.user.tag}] Kanal bulunamadığından giriş yapamadı.`)
        client.joinChannel(find, obj);
        if(!get_channel) await Database.set("channel", find.id).write();
        if(get_channel && get_channel != find.id) await Database.set("channel", find.id).write();

        client.user.setStatus("dnd")
        RPC(client)
    })
    client.on("presenceUpdate", (oldPresence, newPresence) => {
        if(!oldPresence) return;
        if(!newPresence) return;
        if(!oldPresence.member) return;
        if(!newPresence.member) return;
        if(oldPresence.member.id != client.user.id || newPresence.member.id != client.user.id) return;
        client.user.setStatus("dnd");
        RPC(client)
        console.log(`[${client.user.tag}] Rahatsız etmeyin dışında olduğu için otomatik olarak rahatsız etmeyin yapıldı.`)
    });

    client.on("voiceStateUpdate", async (oldState, newState) => {
        if(oldState.channel && !newState.channel && client.user.id == oldState.user.id) {
            console.log(`[${client.user.tag}] Kanaldan Düştü Tekrardan Giriş Yapılacak.`)
            setTimeout(async () => {
                const dirDatabase = new FileSync(`./Databases/${client.user.id}.json`);
                const Database = low(dirDatabase)
                let get_channel = await Database.get("channel").value();
                let find =  client.channels.cache.get(get_channel) || client.channels.cache.get(channel);
                if(!find) return console.log(`[${client.user.tag}] Kanal bulunamadığından giriş yapamadı.`)
                client.joinChannel(find, obj);
            }, 2300);
        }
        if(oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
                if(oldState.member.id == client.user.id) {
                    console.log(`[${client.user.tag}] Kanalı ${oldState.channel.name} kanalından ${newState.channel.name} kanalı olarak değiştirildi.`)
                    const dirDatabase = new FileSync(`./Databases/${client.user.id}.json`);
                    const Database = low(dirDatabase)
                    await Database.set("channel", newState.channelId).write();
                }
        }

    })

}







function RPC(client, game) {
    if(game) {
        


        return;
    }
    let SpotifyObj = Spotify.items.map(x => {
        let artist = x.track.album.artists.map(x => x.name).join(", ")
        let artistid =  x.track.album.artists.map(x => x.id)
        let album = x.track.album.name
        let albumid = String(x.track.album.uri.replace("spotify:album:", ""))
        let id = x.track.id
        let track = x.track.name
        let image = String(x.track.album.images[0].url.replace("https://i.scdn.co/image/", ""))
        let duration = x.track.duration_ms
        return {
            id,
            artist,
            artistid,
            album,
            albumid,
            track,
            image,
            duration
        }
    
    })
    let Track = SpotifyObj[Math.floor(Math.random()*SpotifyObj.length)]
    setTimeout(() => {
        RPC(client)
       
    }, Track.duration);

    client.user.setActivity(new SpotifyRPC(client)
    .setAssetsLargeImage(`spotify:${Track.image}`)
    .setAssetsLargeText(Track.album) 
    .setState(`${Track.artist}`) 
    .setDetails(Track.track) 
    .setStartTimestamp(Date.now())
    .setEndTimestamp(Date.now() + Track.duration) 
    .setSongId(Track.id) 
    .setAlbumId(Track.albumid)
    .setArtistIds(Track.artistid));
}