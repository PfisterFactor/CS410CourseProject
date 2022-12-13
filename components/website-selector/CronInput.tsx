import { useEffect, useState } from "react";

export default (props: any) => {
    return (
        <div className="max-w-md">
            <div className="flex items-center text-gray-400 border rounded-md">
                <div className="px-3 py-2.5 rounded-l-md bg-gray-50 border-r">
                    CRON
                </div>
                <input 
                    type="text"
                    placeholder="0 0 * * *"
                    id="cron-input"
                    className="w-full p-2.5 ml-2 bg-transparent outline-none"
                    onChange={(e) => props.onChange(e.target.value)}
                    value={props.value}
                />
            </div>
        </div>
    )
}
