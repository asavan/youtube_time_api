import { open } from "node:fs/promises";
import {isTask} from "./markdown.js";
import {parse_id_from_line} from "./youtube_url.js";
import {getIdFromTask} from "./common_reader.js";

async function allReader(filename, mask) {
    const ids = [];

    const NO_PARSE = 0;
    const PARSE_VID = 1;
    const PARSE_CARDLINK = 2;
    const PARSE_TASK = 4;
    // const PARSE_TASK_OPENED = 8;
    const PARSE_TASK_CLOSED = 16;


    let parse_next_line = NO_PARSE;

    const file = await open(filename);
    try {
        for await (const line of file.readLines()) {
            let id = "";
            if (isTask(line, mask & PARSE_TASK_CLOSED)) {
                parse_next_line = PARSE_TASK;
            }
            if (parse_next_line === PARSE_VID && (PARSE_VID & mask)) {
                id = parse_id_from_line(line);
                if (id === "") {
                    console.error("unknown format", line);
                }
                parse_next_line = NO_PARSE;
            }
            if (parse_next_line === PARSE_CARDLINK && (PARSE_CARDLINK & mask)) {
                id = parse_id_from_line(line.replace("url: ", ""));
                if (id === "") {
                    console.error("unknown format in cardlink", line);
                }
                parse_next_line = NO_PARSE;
            }
            if (parse_next_line === PARSE_TASK && (PARSE_TASK & mask)) {
                id = getIdFromTask(line);
                if (id === "") {
                    console.error("unknown format in PARSE_TASK", line);
                }
                parse_next_line = NO_PARSE;
            }
            if (line === "```vid") {
                parse_next_line = PARSE_VID;
            }
            if (line === "```cardlink") {
                parse_next_line = PARSE_CARDLINK;
            }
            if (id !== "") {
                ids.push(id);
            }
        }
    } finally {
        await file?.close();
    }
    return ids;
}

function allReaderBinded(mask) {
    return (filename) => allReader(filename, mask);
}

export {
    allReaderBinded
};
