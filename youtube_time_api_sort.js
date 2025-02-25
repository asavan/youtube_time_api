
import { open } from "node:fs/promises";
import { parse, toSeconds } from "iso8601-duration";
import { fetch, setGlobalDispatcher, Agent} from "undici";

setGlobalDispatcher(new Agent({connect: { timeout: 80_000 }}));

const toHHMMSS = (sec_num) => {
    // const sec_num = parseInt(secs, 10)
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
};

const isTaskUnresolved = (line) => line.trim().startsWith("- [ ]");
const isTaskResolved = (line) => line.trim().startsWith("- [x]");

const isTask = (line, collectResolved) => isTaskUnresolved(line) || (collectResolved && isTaskResolved(line));

const extractUrlFromMdLink = (line) => {
    const firstPar = line.indexOf("](");
    if (firstPar < 0) {
        return "";
    }
    const closePar = line.indexOf(")", firstPar);
    if (closePar < 0) {
        return "";
    }
    return line.substring(firstPar + 2, closePar);
};

const getIdFromTask = (line) => {
    const link = extractUrlFromMdLink(line);
    // console.log(link);
    return parse_id_from_line(link);
};

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

/*
function full_url(id) {
    return "https://www.youtube.com/watch?v=" + id;
}

function wrapper(url) {
    return "```vid\n" + url + "\n```\n";
}
*/

// const api_url = "https://yt.lemnoslife.com/noKey/videos?part=contentDetails&fields=items(contentDetails)&id=";

const apiUrlFunc = (apiKey) => "https://www.googleapis.com/youtube/v3/videos?key=" +
    apiKey + "&part=contentDetails,snippet&fields=items(contentDetails,snippet)&id=";

// https://github.com/jsmreese/moment-duration-format
// https://yt.lemnoslife.com/noKey/videos?part=contentDetails&fields=items&id=Ks-_Mh1QhMc,c0KYU2j0TM4,eIho2S0ZahI
// https://gist.github.com/productioncoder/d306fcbf3944ba7e1c9f25ef3c9c9072

function parse_id_from_line(text) {
    const line = text.trim().split(/\s+/)[0];
    if (line === "") {
        return "";
    }
    const url = new URL(line);
    if (!url.hostname.includes("youtube.com")) {
        if (url.hostname.includes("youtu.be")) {
            return url.pathname.replace("/", "");
        }
        return "";
    }

    const id = url.searchParams.get("v");
    // console.log(url.href);
    if (id) {
        return id;
    }
    return url.pathname.replace("/shorts/", "");
}


const split_to_chunk = (list, size) => [...Array(Math.ceil(list.length / size))].
    map((_, i) => list.slice(i * size, i * size + size));

async function parse_one_file(filename, reader) {
    const ids = await reader(filename);
    console.log("videos found", ids.length);
    if (ids.length === 0) {
        return "";
    }
    const res = [];
    const chunks = split_to_chunk(ids, 50);
    for (const chunk of chunks) {
        const url_to_fetch = apiUrlFunc(process.env.YOUTUBE_API_KEY) + chunk.join();
        const resp = await fetch(url_to_fetch).then((response) => response.json());
        // console.log(url_to_fetch);
        if (!resp.items) {
            console.log(resp);
            return res;
        }
        for (const item of resp.items) {
            // console.log(item.snippet.channelTitle);
            const sec = toSeconds(parse(item.contentDetails.duration));
            item.seconds = sec;
            res.push(item);
        }
    }
    return res;
}

async function main() {
    console.log(process.argv);
    const file = process.argv[2] || "C:\\obsidian\\obsidian\\todo\\посмотреть.md";
    const mask = parseInt(process.argv[3]) || 3;
    const limit = parseInt(process.argv[4]) || 10;
    const funck = allReaderBinded(mask);
    const res = await parse_one_file(file, funck);

    // console.log(res);
    res.sort((a, b) => a.seconds - b.seconds);
    const firstK = res.slice(0, limit);

    const defaultDict = new Proxy({}, {
        get: (target, name) => name in target ? target[name] : 0
    });

    for (const item of firstK) {
        const name1 = item.snippet.channelTitle;
        defaultDict[name1] += item.seconds;
    }

    const sortable = Object.entries(defaultDict).
        sort(([, a], [, b]) => -(a-b)).map(([n, a]) => ([n, toHHMMSS(a)]));

    const names = firstK.map(e => e.snippet.title + " " + toHHMMSS(e.seconds));
    console.log(names);

    console.log(sortable);

    const allTime = firstK.map(e => e.seconds).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(toHHMMSS(allTime));
}

main();
