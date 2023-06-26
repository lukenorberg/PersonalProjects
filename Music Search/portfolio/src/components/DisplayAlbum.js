import {useState} from "react";

function DisplayAlbum({ jsonData, setPopup, setForm}) {
    const [isExpanded, setIsExpanded] = useState(false)

    const data = jsonData.album

    const secToTime = (seconds) => {
        seconds = +seconds
        if (seconds === 0) {
            return "N/A";
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${minutes}:${(secs < 10) ? '0' : ''}${secs}`;
    };

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

    const handleTrack = (event) => {
        setForm({
            selected: 'song',
            search: `${data.artist}`,
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
            search: `${data.artist}`,
            secondSearch: ''
        })
        setPopup(false)
        setTimeout(() => {
            setPopup(true)
        }, 100)
    }

    return (
        <div className="rounded-lg bg-gray-200 lg:w-860 sm:w-11/12 sm:mt-8 drop-shadow">
            <div className="flex justify-end sm:mx-4">
                <button onClick={handleSetPopup}>
                    <img src="https://cdn.onlinewebfonts.com/svg/img_489668.png"
                         className="h-8 w-auto mt-4 opacity-75"
                         alt="close"/>
                </button>

            </div>
            <div className="flex flex-col my-2 px-6 text-xl justify-between sm:flex-row sm:mx-4 sm:mt-6">
                <div className="flex flex-col py-4">
                    <div className="flex flex-col justify-center items-center mb-6 sm:mb-4">
                        <div
                            className="text-blue-600 font-semibold hover:text-blue-400"
                            onClick={handleArtist}>
                            {data.artist}
                        </div>
                        <div className="font-bold text-5xl my-2 mb-4 text-center">
                            {data.name}
                        </div>
                    </div>
                    <div>
                        <span className="font-bold mr-2">Listeners</span> {displayListeners(data.playcount)}
                    </div>
                </div>
                <div className="mb-8">
                    {data.image && data.image[2] && <Image data={data}/>
                    }
                </div>
            </div>
            <div className="flex flex-col px-4 justify-center items-center mb-10 sm:items-center sm:mx-4">
                <p>
                    {
                        data.wiki && data.wiki.summary && (
                            isExpanded
                                ? data.wiki.summary.replace(/<a href.*/, '')
                                : data.wiki.summary.replace(/<a href.*/, '').slice(0, 100) + '...'
                        )
                    }
                </p>
                {data.wiki && data.wiki.summary && data.wiki.summary.length >= 100 && <ParagraphBtn
                    handleIsExpanded={handleIsExpanded}
                    isExpanded={isExpanded}
                />}

            </div>
            <div className="flex justify-center my-4 bg-gray-300 mx-0">
                <table className="w-full my-6 sm:w-11/12">
                    <caption className="font-semibold">
                        {Array.isArray(data.tracks.track)
                            ? "Tracklist"
                            : "No Tracklist Found"
                        }
                    </caption>
                    <tbody>
                    { Array.isArray(data.tracks.track) && data.tracks.track.map((song, index) =>
                        <tr key={song.url}
                            id={song.name}
                            onClick={handleTrack}
                            className="flex border-b-2 p-3 px-4 border-gray-400 pb-4 hover:bg-gray-400 transition-all">
                            <td
                                className="w-9 text-right pr-4"
                            >{index + 1}</td>
                            <td className="ml-5 font-semibold w-11/12">{song.name}</td>
                            <td className=" text-right">{secToTime(song.duration)}</td>
                        </tr>
                    )
                    }
                    </tbody>
                </table>
            </div>

            <div className="flex items-center sm:mx-4">
                <ul className="flex my-4 flex-wrap justify-center">
                    { Array.isArray(data.tags.tag) && data.tags.tag.map(name =>
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

function Image({ data }) {
    return (
        <img
            src={data.image && data.image[3] && data.image[3]['#text']}
            className="mb-4 w-full"
            alt="album cover">
        </img>
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

export default DisplayAlbum