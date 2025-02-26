import {parse, toSeconds} from "iso8601-duration";
import {process_chunks} from "./youtube_api.js";

async function parse_one_file_duration(api_url, filename, reader) {
    const ids = await reader(filename);
    console.log("videos found", ids.length);
    if (ids.length === 0) {
        return "";
    }
    const processOne = item => {
        item.seconds = toSeconds(parse(item.contentDetails.duration));
        return [item];
    };
    return process_chunks(api_url, ids, processOne);
}

export {
    parse_one_file_duration,
};
