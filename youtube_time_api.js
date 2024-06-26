"use strict";

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

const isTask = (line, collectResolved) => {
    return isTaskUnresolved(line) || (collectResolved && isTaskResolved(line));
}

const extractUrlFromMdLink = (line)  => {
   const firstPar = line.indexOf("](");
   if (firstPar < 0) return "";
   const closePar = line.indexOf(")", firstPar);
   if (closePar < 0) return "";
   return line.substring(firstPar + 2, closePar);
}

const getIdFromTask = (line) => {
    const link = extractUrlFromMdLink(line);
    // console.log(link);
    return parse_id_from_line(link);
}


async function vidReader(filename) {
    const ids = [];
    
    const NO_PARSE = 0;
    const PARSE_VID = 1;
    const PARSE_CARDLINK = 2;
    const PARSE_TASK = 4;
    
    
    let parse_next_line = NO_PARSE;
    
    const file = await open(filename);
    try {
        for await (const line of file.readLines()) {
            let id = "";
            if (isTask(line, false)) {
                parse_next_line = PARSE_TASK;
            }
            if (parse_next_line === PARSE_VID) {
                id = parse_id_from_line(line);
                if (id !== "") {
                    
                } else {
                    console.error("unknown format", line);
                }
                parse_next_line = NO_PARSE;
            }
            if (parse_next_line === PARSE_CARDLINK) {
                id = parse_id_from_line(line.replace("url: ", ""));
                if (id !== "") {
                    
                } else {
                    console.error("unknown format in cardlink", line);
                }
                parse_next_line = NO_PARSE;
            }
            if (parse_next_line === PARSE_TASK) {
                id = getIdFromTask(line);
                if (id !== "") {                    
                } else {
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

async function allReader(filename, mask) {
    const ids = [];
    
    const NO_PARSE = 0;
    const PARSE_VID = 1;
    const PARSE_CARDLINK = 2;
    const PARSE_TASK = 4;
    const PARSE_TASK_OPENED = 8;
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
                if (id !== "") {
                    
                } else {
                    console.error("unknown format", line);
                }
                parse_next_line = NO_PARSE;
            }
            if (parse_next_line === PARSE_CARDLINK && (PARSE_CARDLINK & mask)) {
                id = parse_id_from_line(line.replace("url: ", ""));
                if (id !== "") {
                    
                } else {
                    console.error("unknown format in cardlink", line);
                }
                parse_next_line = NO_PARSE;
            }
            if (parse_next_line === PARSE_TASK && (PARSE_TASK & mask)) {
                id = getIdFromTask(line);
                if (id !== "") {                    
                } else {
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



async function taskReader(filename) {
    const ids = [];
    
    const NO_PARSE = 0;
    const PARSE_VID = 1;
    const PARSE_CARDLINK = 2;
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
                if (id !== "") {                    
                } else {
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


async function shortReader(filename) {
    const ids = [];
    let parse_next_line = false;
    
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

function full_url(id) {
    return "https://www.youtube.com/watch?v=" + id;
}

function wrapper(url) {
    return "```vid\n" + url + "\n```\n";
}


// const api_url = "https://yt.lemnoslife.com/noKey/videos?part=contentDetails&fields=items(contentDetails)&id=";
const api_url = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyC5R4iDrUmqxn3XpY77Xzfz23ruJQMwb5o&part=contentDetails&fields=items(contentDetails)&id=";

// AIzaSyC5R4iDrUmqxn3XpY77Xzfz23ruJQMwb5o
// AIzaSyC5R4iDrUmqxn3XpY77Xzfz23ruJQMwb5o
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

function parse_short_id_from_line(text) {
    const regexpYou = new RegExp("https://www.youtube.com/watch\\?v=([\\w-]+)");
    const match = text.match(regexpYou);
    if (match === null) {
        return "";
    }
    const id = match[1];
    if (id) {
        return id;
    }
    return "";
}

function split_to_chunk2(arr, chunkSize) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
}

const split_to_chunk = (list, size) => [...Array(Math.ceil(list.length / size))].map((_, i) => list.slice(i * size, i * size + size));

async function parse_one_file(filename, reader) {
    const ids = await reader(filename);
    console.log("videos found", ids.length);
    if (ids.length === 0) {
        return "";
    }
    let summ = 0;
    const chunks = split_to_chunk(ids, 50);
    for (const chunk of chunks) {
        const url_to_fetch = api_url + chunk.join();
        const resp = await fetch(url_to_fetch).then((response) => response.json());
        // console.log(resp);
        
        for (const item of resp.items) {
            summ += toSeconds(parse(item.contentDetails.duration));
        }        
    }
    return toHHMMSS(summ);    
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
