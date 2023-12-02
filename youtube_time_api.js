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


async function vidReader(filename) {
    const ids = [];
    let parse_next_line = false;
    
    const file = await open(filename);
    try {
        for await (const line of file.readLines()) {
            if (parse_next_line) {
                const id = parse_id_from_line(line);
                if (id !== "") {
                    ids.push(id);
                } else {
                    console.error("unknown format", line);
                }
                parse_next_line = false;
            }
            if (line === "```vid") {
                parse_next_line = true;
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


const api_url = "https://yt.lemnoslife.com/noKey/videos?part=contentDetails&fields=items(contentDetails)&id=";
// https://github.com/jsmreese/moment-duration-format
// https://yt.lemnoslife.com/noKey/videos?part=contentDetails&fields=items&id=Ks-_Mh1QhMc,c0KYU2j0TM4,eIho2S0ZahI
// https://gist.github.com/productioncoder/d306fcbf3944ba7e1c9f25ef3c9c9072

function parse_id_from_line(text) {
    const line = text.split(/\s+/)[0];
    const url = new URL(line);
    if (!url.hostname.includes("youtube.com")) {
        if (url.hostname.includes("youtu.be")) {
            return url.pathname.replace("/", "");
        }
        return "";
    }
    
    const id = url.searchParams.get("v");
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

async function parse_one_file(filename, reader) {
    const ids = await reader(filename);
    if (ids.length === 0) {
        return "";
    }
    const url_to_fetch = api_url + ids.join();
    const resp = await fetch(url_to_fetch).then((response) => response.json());
    let summ = 0;
    for (const item of resp.items) {
        summ += toSeconds(parse(item.contentDetails.duration));
    }
    return toHHMMSS(summ);    
}

async function main() {
    if (process.argv[3] === "short") {        
        const res = await parse_one_file(process.argv[2], shortReader);
        console.log(res);
        return;        
    }
    const res = await parse_one_file(process.argv[2] || "2023-11-29.md", vidReader);
    console.log(res);
}

main();
