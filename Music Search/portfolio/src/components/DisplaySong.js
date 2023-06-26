import { useState } from "react";

function DisplaySong({ jsonData, setPopup, setForm}) {
    const [isExpanded, setIsExpanded] = useState(false)

    const data = jsonData.track

    const msToSec = (ms) => {
        ms = +ms;
        if (ms === 0) {
            return "N/A"
        }
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        const formattedSecs = (secs < 10) ? `0${secs}` : secs;
        return `${mins}:${formattedSecs}`;
    }

    const displayListeners = (listens) => {
        listens = +listens;
        let formatted = listens.toLocaleString();
        let numOfCommas = 0;
        let firstComma = 0;
        let firstCommaFound = false;

        for (let char in formatted) {
            if (!firstCommaFound && formatted[char] === ',') {
                firstCommaFound = true;
                firstComma = char;
                numOfCommas++;
            } else if (formatted[char] === ',') {
                numOfCommas++;
            }
        }
        let final = `${formatted.substring(0, firstComma)}`
        if (formatted.charAt(+firstComma+1) !== '0') {
            final += `.${formatted.charAt(+firstComma+1)}`
        }
        switch (numOfCommas) {
            case 1: final += 'K'; break;
            case 2: final += 'M'; break;
            case 3: final += 'B'; break;
        }
        return (numOfCommas > 0) ? final : listens;
    }

    const handleIsExpanded = () => {
        setIsExpanded(!isExpanded);
    }

    const handleSetPopup = () => {
        setPopup(false);
    }

    const handleAlbum = (event) => {
        setForm({
            selected: 'album',
            search: `${data.artist.name}`,
            secondSearch: `${event.currentTarget.id}`
        })
        setPopup(false)
        setTimeout(() => {
            setPopup(true)
        }, 100)
    }

    const handleArtist = (event) => {
        setForm({
            selected: 'artist',
            search: `${data.artist.name}`,
            secondSearch: ''
        })
        setPopup(false)
        setTimeout(() => {
            setPopup(true)
        }, 100)
    }

    return (
        <div className="rounded-lg bg-gray-200 px-4 h-full lg:w-860 sm:w-11/12 sm:mt-8 sm:p-4">

            <div className="flex justify-end">
                <button onClick={handleSetPopup}>
                    <img src="https://cdn.onlinewebfonts.com/svg/img_489668.png"
                         className="h-8 w-auto mt-4 opacity-75"
                         alt="close"/>
                </button>

            </div>
            <div className="flex flex-col px-6 text-xl justify-between sm:flex-row">
                <div className="flex flex-col py-4">
                    <div className="flex flex-col items-center py-4">
                        <div onClick={handleArtist}
                            className="text-blue-600 font-semibold hover:text-blue-400">
                            {data.artist.name}
                        </div>
                        <div className="font-bold text-5xl my-2 mb-4">
                            {data.name}
                        </div>
                    </div>
                    <div>
                        <span className="font-bold mr-2">Listeners</span> {displayListeners(data.listeners)}
                    </div>
                    <div>
                        <span className="font-bold mr-2">Length</span> {msToSec(data.duration)}
                    </div>
                </div>
                <button
                    onClick={handleAlbum}
                    id={ data.album && data.album.title}
                    className="flex flex-col justify-center items-center py-8">
                    {data.album && data.album.image && data.album.image[2]['#text'] && <Image data={data}/>
                    }
                    <div className="font-bold my-2">
                        {data.album && data.album.title}
                    </div>
                </button>
            </div>
            <div>
                <p>
                    {
                        data.wiki && (
                            isExpanded
                                ? data.wiki.summary.replace(/<a href.*/, '')
                                : data.wiki.summary.replace(/<a href.*/, '').slice(0, 100) + '...'
                        )
                    }
                </p>
                {data.wiki && data.wiki.summary.length >= 100 && <ParagraphBtn
                    handleIsExpanded={handleIsExpanded}
                    isExpanded={isExpanded}
                />}

            </div>

            <div className="flex items-center">
                <ul className="flex my-4 flex-wrap justify-center">
                    {data.toptags.tag.map(name =>
                        <li key={name.url}
                            className="py-4"
                        >
                            <a href={name.url}
                               className="mx-3 border border-blue-400 p-2 rounded-lg hover:bg-sky-200">
                                {name.name}
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

function ParagraphBtn({ handleIsExpanded, isExpanded }) {
    return (
        <button onClick={handleIsExpanded}
                className="text-blue-600">
            {isExpanded ? 'read less' : 'read more'}
        </button>
    )
}

function Image({ data }) {
    return (
        <img
            src={data.album && data.album.image && data.album.image[3]['#text']}
            alt="album cover">
        </img>
    )
}

export default DisplaySong