import { useState } from "react"

interface WebsiteUrlInputProps {
    onSearchClicked: (url: string) => void
}

export default (props: WebsiteUrlInputProps) => {
    const [website,setWebsite] = useState("");
    return (
        <div className="max-w-md px-4">
            <label htmlFor="website-url" className="block py-2 text-black-500">
                Website URL
            </label>
            <div className="flex items-center text-black-400 border rounded-md">
                <div className="px-3 py-2.5 rounded-l-md bg-gray-50 border-r">
                    https://
                </div>
                <input
                    type="text"
                    placeholder="www.example.com"
                    value={website}
                    onInput={(e) => setWebsite(e.target.value)}
                    id="website-url"
                    className="w-full p-2.5 ml-2 bg-transparent outline-none text-black-300"
                />
                <button onClick={(e) => props.onSearchClicked("https://" + website)} className="px-3 py-2.5 rounded-r-md bg-gray-50 border-l">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" /></svg>
                </button>
            </div>
        </div>
    )
}