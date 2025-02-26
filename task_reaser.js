import { open } from "node:fs/promises";
import {isTask} from "./markdown.js";
import {getIdFromTask} from "./common_reader.js";

async function taskReader(filename) {
    const ids = [];

    const NO_PARSE = 0;
    // const PARSE_VID = 1;
    // const PARSE_CARDLINK = 2;
    const PARSE_TASK = 4;


    let parse_next_line = NO_PARSE;

    const file = await open(filename);
    try {
        for await (const line of file.readLines()) {
            let id = "";
            if (isTask(line, false)) {
                parse_next_line = PARSE_TASK;
            }
            if (parse_next_line === PARSE_TASK) {
                id = getIdFromTask(line);
                if (id === "") {
                    console.error("unknown format in PARSE_TASK", line);
                }
                parse_next_line = NO_PARSE;
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

export {
    taskReader,
};
