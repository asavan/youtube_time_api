import {extractUrlFromMdLink} from "./markdown.js";
import {parse_id_from_line} from "./youtube_url.js";

const getIdFromTask = (line) => {
    const link = extractUrlFromMdLink(line);
    // console.log(link);
    return parse_id_from_line(link);
};

export {
    getIdFromTask,
};
