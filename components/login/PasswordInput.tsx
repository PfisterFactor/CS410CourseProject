interface PasswordInputProps {
    value: string
    onChange: (p: string) => void
}

export const PasswordInput = (props: PasswordInputProps) => {
    return (
        <div
            className="max-w-md px-4 mx-auto mt-6">
                <div>
                    <label htmlFor="email" className="block py-3 text-gray-500">
                        Password
                    </label>
                    <div className="flex items-center p-2 border rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 w-6 h-6" viewBox="0 0 512 512" fill="currentColor"><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z"/></svg>
                        <input
                            type="password"
                            placeholder="********"
                            id="password"
                            name="password"
                            className="w-full p-1 ml-3 text-gray-500 outline-none bg-transparent"
                            onChange={(e) => props.onChange(e.target.value)}
                            value={props.value}
                        />
                    </div>
                </div>
        </div>
    )
}
