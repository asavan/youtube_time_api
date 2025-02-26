
import {toHHMMSS} from "./time.js";
import {parse_one_file_duration} from "./youtube_duration.js";
import {allReaderBinded} from "./all_reader.js";
import {shortReader} from "./short_reader.js";
import {taskReader} from "./task_reaser.js";
import {vidReader} from "./vid_reader.js";
import {durationApi} from "./youtube_api.js";

const api_url = durationApi(process.env.YOUTUBE_API_KEY);

async function parse_one_file(filename, reader) {
    const arr = await parse_one_file_duration(api_url, filename, reader);
    const allTime = arr.map(e => e.seconds).reduce((acc, curr) => acc + curr, 0);
    return toHHMMSS(allTime);
}

async function main() {

    if (process.argv[3] === "short") {
        const res = await parse_one_file(process.argv[2], shortReader);
        console.log(res);
        return;
    }
    if (process.argv[3] === "task") {
        const res = await parse_one_file(process.argv[2], taskReader);
        console.log(res);
        return;
    }

    if (parseInt(process.argv[3]) > 0) {
        const funck = allReaderBinded(parseInt(process.argv[3]));
        const res = await parse_one_file(process.argv[2], funck);
        console.log("number", res);
        return;
    }
    const res = await parse_one_file(process.argv[2] || "2023-11-29.md", vidReader);
    console.log(res);
}

main();
