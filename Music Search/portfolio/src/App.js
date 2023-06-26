import { useState, useEffect } from 'react'
import Popup from './components/Popup'
import './index.css'

function App() {
    const [popup, setPopup] = useState(false)
    const [form, setForm] = useState({
        selected: 'song',
        search: '',
        secondSearch: '',
    })

    const musicData = [
        {
            id: 1,
            type: 'song'
        },
        {
            id: 2,
            type: 'album'
        },
        {
            id: 3,
            type: 'artist'
        },

    ]

    const handleSubmit = (event) => {
        event.preventDefault()
        setPopup(false)
        setTimeout(() => {
            setPopup(true)
        }, 100)
    }

    const handleSelectedChange = (event) => {
        setForm({
            selected: event.target.value,
            search: '',
            secondSearch: '',
        })
    }

    const handleSearch = (event) => {
        setForm({...form,
            search: event.target.value})
    }

    const handleSecondSearch = (event) => {
        setForm({...form,
            secondSearch: event.target.value})
    }

    const checkAlbum = () => {
        if (form.selected === "artist") {
            return (
                <label>
                    <input type="text"
                       placeholder="search artist"
                       value={form.search}
                       onChange={handleSearch}
                       className="rounded-xl mx-2 p-2 w-80"
                    />
                </label>
            )
        }
        return (
            <div className="flex justify-center items-center flex-col lg:flex-row">
                <label>
                    <input type="text"
                           placeholder="search artist"
                           value={form.search}
                           onChange={handleSearch}
                           className="rounded-xl mx-2 p-2 w-80 my-2"
                    />
                </label>
                <label>
                    <input type="text"
                           placeholder={(form.selected === 'song') ? 'search song': 'search album'}
                           value={form.secondSearch}
                           onChange={handleSecondSearch}
                           className="rounded-xl mx-2 p-2 w-80 my-2"
                    />
                </label>
            </div>

        )
    }


    return (
    <div className="text-lg font-montserrat">
        <div>
            <nav className="p-4 bg-blue-700 sm:drop-shadow">
            <form className="px-8 flex justify-center flex-col xl:flex-row lg:justify-evenly">
                <div className="flex items-center flex-col justify-center lg:flex-row">
                    {checkAlbum()}
                    <button onClick={handleSubmit}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 rounded w-80 my-4 lg:w-20 lg:text-center"
                    >Submit</button>
                </div>
                <div className="buttons flex items-center justify-center">
                    {musicData.map(data =>
                        <label key={data.id}
                               className="mx-6 flex flex-col items-center sm:flex-row text-white"
                               style={form.selected === data.type ? { fontWeight: 'bold' } : undefined}
                        >
                            <input type="radio" value={data.type}
                                   className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                                   checked={form.selected === data.type}
                                   onChange={handleSelectedChange}
                            />
                            {data.type}
                        </label>
                    )}
                </div>
            </form>
            </nav>
        </div>

        {popup && <Popup form={form} setPopup={setPopup} setForm={setForm}/>}
    </div>
  );
}

export default App;
