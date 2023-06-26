import {useEffect, useState} from "react";

function DisplayArtist({ jsonData, setPopup, topAlbums, setForm }) {
    const [albumData, setAlbumData] = useState({})
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
            const fetchData = async () => {
                const result = await fetch(topAlbums)
                result.json().then(json => {
                    setAlbumData(json.topalbums)
                })
            }
            fetchData()
        }, []
    )

    const data = jsonData.artist

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
            search: `${data.name}`,
            secondSearch: `${event.currentTarget.id}`
        })
        setPopup(false)
        setTimeout(() => {
            setPopup(true)
        }, 100)
    }


    console.log(albumData)
    console.log(jsonData)
    return (
        <div className=" w-full rounded-lg bg-gray-300 px-4 h-full lg:w-860 sm:w-11/12 sm:mt-8 sm:p-4">
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
                        <div className="font-bold text-4xl">
                            {data && data.name}
                        </div>
                    </div>
                    <div>
                        <span className="font-bold mr-2">Listeners</span> {data && displayListeners(data.stats.listeners)}
                    </div>
                    <div>
                        <span className="font-bold mr-2">{ data && data.ontour === "1" && "Currently On Tour"}</span>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center py-8">
                    {data && data.image && data.image[3]['#text'] && <HomeImage data={albumData}/>
                    }
                </div>
            </div>
            <div>
                <p>
                    {
                        data && data.bio && (
                            isExpanded
                                ? data.bio.summary.replace(/<a href.*/, '')
                                : data.bio.summary.replace(/<a href.*/, '').slice(0, 100) + '...'
                        )
                    }
                </p>
                {data && data.bio && data.bio.summary.length >= 100 && <ParagraphBtn
                    handleIsExpanded={handleIsExpanded}
                    isExpanded={isExpanded}
                />}

            </div>
            <div className="font-semibold mt-8 mb-[-15px]">Top Albums</div>
            <div className="flex items-center relative h-[20rem] overflow-x-auto overflow-y-visible">
                <ul className="flex my-4 absolute w-[1200px] h-[250px]">
                    {albumData && albumData.album && albumData.album.map((name, index) => {
                            if (index < 5) {
                                return (
                                    <li key={name.url}
                                        className=" flex flex-col justify-between h-full pr-5 transition-all hover:translate-y-1"
                                    >

                                        <button onClick={handleAlbum}
                                           className="w-[200px]"
                                            id={name.name}
                                        >
                                            <div className="w-[200px] h-auto">
                                                {data.image && <Image data={name} width={"w-[200px] h-auto"} />}
                                                {name.name}
                                            </div>
                                        </button>

                                    </li>
                                );
                            }
                        }

                    )}
                </ul>
            </div>

            <div className="flex items-center">
                <ul className="flex my-4 flex-wrap justify-center">
                    {data && data.tags && data.tags.tag.map(name =>
                        <li key={name.url}
                            className="py-4 translate-y-1"
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
        <div
            id={data.name}
        >
            <img
                src={data.image && data.image[3]['#text']}
                alt="artist picture">
            </img>
        </div>
    )
}

function HomeImage({ data }) {
    return (
        <img
            src={data.album && data.album[0] && data.album[0].image && data.album[0].image[3]['#text']}
            alt="artist picture">
        </img>
    )
}

export default DisplayArtist