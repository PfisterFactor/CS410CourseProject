import { useEffect, useState } from "react";

export default (props: any) => {
    const [value, setValue] = useState("");
    useEffect(() => {
        props.onChange(value);
    }, [value]);
    return (
        <div className="max-w-md px-4 mx-auto mt-12">
            <div className="flex items-center text-gray-400 border rounded-md">
                <div className="px-3 py-2.5 rounded-l-md bg-gray-50 border-r">
                    CRON
                </div>
                <input 
                    type="text"
                    placeholder="0 0 * * *"
                    value={value}
                    id="cron-input"
                    className="w-full p-2.5 ml-2 bg-transparent outline-none"
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}
