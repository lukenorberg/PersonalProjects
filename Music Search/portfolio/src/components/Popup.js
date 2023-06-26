import {useEffect, useState} from "react";
import DisplaySong from "./DisplaySong";
import DisplayAlbum from "./DisplayAlbum";
import DisplayArtist from "./DisplayArtist";

function Popup({form, setForm, setPopup}) {
    const [jsonData, setJsonData] = useState({})

    const apiKey = 'dbbc69033e43f2713a1c2d7217652d33';
    const site = 'https://ws.audioscrobbler.com/2.0/?'
    const topAlbums = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${form.search}&api_key=${apiKey}&format=json`

    useEffect(() => {
        const choice = {
            song: `${site}method=track.getInfo&api_key=${apiKey}&artist=${form.search}&track=${form.secondSearch}&format=json`,
            album: `${site}method=album.getinfo&api_key=${apiKey}&artist=${form.search}&album=${form.secondSearch}&format=json`,
            artist: `${site}method=artist.getinfo&artist=${form.search}&api_key=${apiKey}&format=json`
        }

        const fetchData = async () => {
            const result = await fetch(choice[form.selected])
            result.json().then(json => {
                setJsonData(json)
            })
        }
        fetchData();

    }, [])
    return (
        <main className="flex justify-center">
            {jsonData.message === "Track not found" && <Error data={jsonData} />}
            {(Object.keys(jsonData).length > 0 && jsonData.track)
                && <DisplaySong jsonData={jsonData} setPopup={setPopup} setForm={setForm}/>}
            {(Object.keys(jsonData).length > 0 && jsonData.album)
                && <DisplayAlbum jsonData={jsonData} setPopup={setPopup} setForm={setForm}/>}
            {(Object.keys(jsonData).length > 0 && jsonData.artist)
                && <DisplayArtist jsonData={jsonData} setPopup={setPopup} topAlbums={topAlbums} setForm={setForm}/>}
        </main>
    )
}



function Error({ data }) {
        return (
            <div>{data.message}</div>
        )
}
export default Popup