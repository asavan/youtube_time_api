import { open } from "node:fs/promises";
import {parse_short_id_from_line} from "./youtube_url.js";

async function shortReader(filename) {
    const ids = [];

    const file = await open(filename);
    try {
        for await (const line of file.readLines()) {
            if (line === "# Not Today") {
                break;
            }
            const id = parse_short_id_from_line(line);
            if (id !== "") {
                ids.push(id);
            }
        }
    } finally {
        await file?.close();
    }
    console.log(ids);
    return ids;
}

export {shortReader};
