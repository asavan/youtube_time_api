import {fetch, setGlobalDispatcher, Agent} from "undici";

setGlobalDispatcher(new Agent({connect: {timeout: 80_000}}));

const longplay = [
    "https://www.youtube.com/watch?v=3czoo9XJ6f4",
    "https://www.youtube.com/watch?v=mxF3eCAUUYs",
    "https://www.youtube.com/watch?v=m33zqPgb5YQ",
    "https://www.youtube.com/watch?v=d3M549AmXdY",
    "https://www.youtube.com/watch?v=Haeb-kbXZE0",
    "https://www.youtube.com/watch?v=4T25zJr9gt0",
    "https://www.youtube.com/watch?v=Ew4I0zxjfYE",
    "https://www.youtube.com/watch?v=4soU-LnV7bo",
    "https://www.youtube.com/watch?v=Q4d7QRaU8IY",
    "https://www.youtube.com/watch?v=uh0vM3MlcuI",
    "https://www.youtube.com/watch?v=waA2Eg6PKx0",
    "https://www.youtube.com/watch?v=DQv3R8gvJ6w",
    "https://www.youtube.com/watch?v=ap298CvIqCE",
    "https://www.youtube.com/watch?v=1OnHpMaDt60",
    "https://www.youtube.com/watch?v=ZHp7pHUharE",
    "https://www.youtube.com/watch?v=PgDeaZSH3PM",
    "https://www.youtube.com/watch?v=Hg6Dq6VRGBY",
    "https://www.youtube.com/watch?v=i7ZDSMJcDr0",
    "https://www.youtube.com/watch?v=TvMa_-fG_D0",
    "https://www.youtube.com/watch?v=UXOD3C95-qY",
    "https://www.youtube.com/watch?v=3oaVsvqNaq0",
    "https://www.youtube.com/watch?v=aT0TATfBq3w",
    "https://www.youtube.com/watch?v=exRuBD8fojI",
    "https://www.youtube.com/watch?v=3EsguqKj45I",
    "https://www.youtube.com/watch?v=Ob1wAzsoxmo",
    "https://www.youtube.com/watch?v=hod9Fz0fUbc",
    "https://www.youtube.com/watch?v=Jk-_w3xOBaQ",
    "https://www.youtube.com/watch?v=LIRJuCpmc-0",
    "https://www.youtube.com/watch?v=53JrR4KOzAo",
    "https://www.youtube.com/watch?v=TR2m8EkUj8Y",
    "https://www.youtube.com/watch?v=j5A3Tyov2tw",
    "https://www.youtube.com/watch?v=A0xQlAqV8XA&t=20s",
    "https://www.youtube.com/watch?v=cL3cfYGGs0k",
    "https://www.youtube.com/watch?v=eyzVnHzR5w8",
    "https://www.youtube.com/watch?v=c6uAc2JaPqI",
    "https://www.youtube.com/watch?v=ILwxSMjfw2Y",
    "https://www.youtube.com/watch?v=tUTf3Rr4cuc",
    "https://www.youtube.com/watch?v=CtKXDU0OV6Y",
    "https://www.youtube.com/watch?v=J8cxZF4BeM8&t=10s",
    "https://www.youtube.com/watch?v=S_6lJqZyuBA",
    "https://www.youtube.com/watch?v=4XddkDnKTr8&t=2s",
    "https://www.youtube.com/watch?v=4cZb7Svq4PI",
    "https://www.youtube.com/watch?v=m_Jxa5bPPqc",
    "https://www.youtube.com/watch?v=h_q_lrU0Gq0",
    "https://www.youtube.com/watch?v=DkVUc7F8MII",
    "https://www.youtube.com/watch?v=4LLiN7nzg6c",
    "https://www.youtube.com/watch?v=KiJ-v8V-OYw",
    "https://www.youtube.com/watch?v=_HhymS6CpgA",
    "https://www.youtube.com/watch?v=dGCckqsdo2k",
    "https://www.youtube.com/watch?v=DN4jEa-x-oI",
    "https://www.youtube.com/watch?v=4TIyzw7kivk",
    "https://www.youtube.com/watch?v=yuqGSNSRjT0",
    "https://www.youtube.com/watch?v=1aYc9wAZVo8",
    "https://www.youtube.com/watch?v=YxyHauVKdPI",
    "https://www.youtube.com/watch?v=YIZn0keFKso",
    "https://www.youtube.com/watch?v=m6zyQcxLLrA",
    "https://www.youtube.com/watch?v=aA-4ESOOPOo&t=935s",
    "https://www.youtube.com/watch?v=asWdfGu_C9s",
    "https://www.youtube.com/watch?v=q6COabwFrtw",
    "https://www.youtube.com/watch?v=2jCgUT-deOc",
    "https://www.youtube.com/watch?v=m7OzUa-1oTc",
    "https://www.youtube.com/watch?v=8tNG-ZZToks",
    "https://www.youtube.com/watch?v=x2sLz2SOq3s&t=953s",
    "https://www.youtube.com/watch?v=qpfdgAW-52Y&t=955s",
    "https://www.youtube.com/watch?v=vaYexfBPmZs",
    "https://www.youtube.com/watch?v=oW-MWNIjy2s",
    "https://www.youtube.com/watch?v=PPfWFDjCuH4",
    "https://www.youtube.com/watch?v=v8r6oIKbSLU",
    "https://www.youtube.com/watch?v=HUCvSzP7D0I",
    "https://www.youtube.com/watch?v=x1I_oJoO4GY&t=924s",
    "https://www.youtube.com/watch?v=FOiUk0gImPY",
    "https://www.youtube.com/watch?v=W_lQn8SHQko",
    "https://www.youtube.com/watch?v=Hv5gpfTOUWA",
    "https://www.youtube.com/watch?v=MlB1Im08BvE",
    "https://www.youtube.com/watch?v=abXl34-E-r8",
    "https://www.youtube.com/watch?v=iIyYQQju-bU",
    "https://www.youtube.com/watch?v=pCQMgWwtfG4",
    "https://www.youtube.com/watch?v=7TR2FwCNPvg",
    "https://www.youtube.com/watch?v=PNde319dfDc&t=928s",
    "https://www.youtube.com/watch?v=OQupyX35OZ0&t=933s",
    "https://www.youtube.com/watch?v=8IbM7v7Pp2w",
    "https://www.youtube.com/watch?v=u2KpiXCLEFI",
    "https://www.youtube.com/watch?v=C4KXCcLAfWk",
    "https://www.youtube.com/watch?v=LXqJjiMns1o",
    "https://www.youtube.com/watch?v=MDucYZCCzBs",
    "https://www.youtube.com/watch?v=5GYFO7U2uMg",
    "https://www.youtube.com/watch?v=wAIJttKoPO8",
    "https://www.youtube.com/watch?v=U7C42YyXMU8",
    "https://www.youtube.com/watch?v=006jmLTCgzQ",
    "https://www.youtube.com/watch?v=xq41pn4qFws",
    "https://www.youtube.com/watch?v=qZe78BG-40c&t=4s",
    "https://www.youtube.com/watch?v=zKRHk8-4kYU&t=612s",
    "https://www.youtube.com/watch?v=ZrZShvaKdmY",
    "https://www.youtube.com/watch?v=M1oT_hlC_4A&t=949s",
    "https://www.youtube.com/watch?v=4g30U3h0qF0",
    "https://www.youtube.com/watch?v=udK8HcsLo5E",
    "https://www.youtube.com/watch?v=dcfRTV4ES1w",
    "https://www.youtube.com/watch?v=IOy8rGcBwTk&t=949s",
    "https://www.youtube.com/watch?v=AecAhDl9FUk",
    "https://www.youtube.com/watch?v=P5WYLkqVyHE"
];


const lirycs = [
    "https://www.youtube.com/watch?v=Q1ZmiQVX9cY",
    "https://www.youtube.com/watch?v=pfacUo-6wNs",
    "https://www.youtube.com/watch?v=39R6j9qkzPo",
    "https://www.youtube.com/watch?v=bK-1Mfb93uA",
    "https://www.youtube.com/watch?v=JXTBwlW02No",
    "https://www.youtube.com/watch?v=VYYzb9KHawI",
    "https://www.youtube.com/watch?v=gYHHQNT6100",
    "https://www.youtube.com/watch?v=YoGUM0AsXJI",
    "https://www.youtube.com/watch?v=q607HENWvqY",
    "https://www.youtube.com/watch?v=iKGmIRAfmCM",
    "https://www.youtube.com/watch?v=mBzEZBF1a_U",
    "https://www.youtube.com/watch?v=YubjPoEmzgU",
    "https://www.youtube.com/watch?v=qoqjZR52lOQ",
    "https://www.youtube.com/watch?v=porv8WwTSgc",
    "https://www.youtube.com/watch?v=4WcGtcKKoWg",
    "https://www.youtube.com/watch?v=kifrPvJigCU",
    "https://www.youtube.com/watch?v=VYsqc9S5b9E",
    "https://www.youtube.com/watch?v=P9bVljfAWS8",
    "https://www.youtube.com/watch?v=9B3N8I4Vidc",
    "https://www.youtube.com/watch?v=bFQBdPHR5Xs",
    "https://www.youtube.com/watch?v=LH3DvvXTxzc",
    "https://www.youtube.com/watch?v=hnyYg62DY4E",
    "https://www.youtube.com/watch?v=RkwsqGM4_DE",
    "https://www.youtube.com/watch?v=szF7osJgt-A",
    "https://www.youtube.com/watch?v=wS79wHHkjjw",
    "https://www.youtube.com/watch?v=GthDbmZFW-w",
    "https://www.youtube.com/watch?v=3WA4YT8fkx8",
    "https://www.youtube.com/watch?v=OpuMLYUuP_M",
    "https://www.youtube.com/watch?v=ie3vumn9Je4",
    "https://www.youtube.com/watch?v=8YXWaEo201o",
    "https://www.youtube.com/watch?v=Db6f982wxPg",
    "https://www.youtube.com/watch?v=eL9OqXpmvOE",
    "https://www.youtube.com/watch?v=S_o49-nmh5w",
    "https://www.youtube.com/watch?v=DrS6_CT0XrU",
    "https://www.youtube.com/watch?v=wWtq4RlbRos",
    "https://www.youtube.com/watch?v=M0IdDCUNivM",
    "https://www.youtube.com/watch?v=DhFuAhFMvms",
    "https://www.youtube.com/watch?v=8__NWVjeyZ8",
    "https://www.youtube.com/watch?v=vVZDZxRRXDI",
    "https://www.youtube.com/watch?v=rJxhpVu7BhU",
    "https://www.youtube.com/watch?v=xK0GkyIVzq4",
    "https://www.youtube.com/watch?v=yXaJpj7Bb9w",
    "https://www.youtube.com/watch?v=gkSAR3jbMjA",
    "https://www.youtube.com/watch?v=138P93_Z_u0",
    "https://www.youtube.com/watch?v=RhVq2oJpsEY",
    "https://www.youtube.com/watch?v=EFxlvlchMw8",
    "https://www.youtube.com/watch?v=PmWIzDuQUQg",
    "https://www.youtube.com/watch?v=v_puTGCZjnA&t=82s",
    "https://www.youtube.com/watch?v=3PBo1GiAlbs&t=955s",
    "https://www.youtube.com/watch?v=ECP4p12A5FY",
    "https://www.youtube.com/watch?v=fwHhuHVNR4I",
    "https://www.youtube.com/watch?v=Sf95qeC7BUs",
    "https://www.youtube.com/watch?v=IgJxh-fJTBU",
    "https://www.youtube.com/watch?v=Z6cbf9WN0c4",
    "https://www.youtube.com/watch?v=GfEdSBXxyHA",
    "https://www.youtube.com/watch?v=7g_56jn0NCA",
    "https://www.youtube.com/watch?v=jTtvWTti3b0",
    "https://www.youtube.com/watch?v=BZEZxzRJ-L4&t=1477s",
    "https://www.youtube.com/watch?v=PYMF1TaqpE4",
    "https://www.youtube.com/watch?v=lYAEH2n3I58",
    "https://www.youtube.com/watch?v=Ei6QuJppkb4",
    "https://www.youtube.com/watch?v=6Ha1lqRKMig&t=363s",
    "https://www.youtube.com/watch?v=Mc0b511IaVU",
    "https://www.youtube.com/watch?v=Nvq6okhPSOw",
    "https://www.youtube.com/watch?v=sujXtr4AVRU",
    "https://www.youtube.com/watch?v=yKC5nekLvbs",
    "https://www.youtube.com/watch?v=3G6JrAq-w4M",
    "https://www.youtube.com/watch?v=yv4o4Epz1eM",
    "https://www.youtube.com/watch?v=dx7dMwMXSAA",
    "https://www.youtube.com/watch?v=e21aHqRYPKE",
    "https://www.youtube.com/watch?v=Fr4ZqY97Bco",
    "https://www.youtube.com/watch?v=ib29EiVnmJM",
    "https://www.youtube.com/watch?v=FZ4waB-THOA",
    "https://www.youtube.com/watch?v=b5gAWk2QuSU",
    "https://www.youtube.com/watch?v=lLoSngvynB8",
    "https://www.youtube.com/watch?v=U8e1Pd7aBLY",
    "https://www.youtube.com/watch?v=3MncoqWP_qg",
    "https://www.youtube.com/watch?v=6_qPAwOsDi0",
    "https://www.youtube.com/watch?v=eLSgNBnpeRg",
    "https://www.youtube.com/watch?v=lgeLlSArJXU",
    "https://www.youtube.com/watch?v=K5zVqoMMj3Y&t=915s",
    "https://www.youtube.com/watch?v=jPVQgOI33V0",
    "https://www.youtube.com/watch?v=xZnMwJQ4mfc&t=284s",
    "https://www.youtube.com/watch?v=iP_siVZjbzc",
    "https://www.youtube.com/watch?v=EhAdb6fIEe0&t=4s"
];

const apiUrlFunc = (apiKey) => "https://www.googleapis.com/youtube/v3/videos?key=" +
    apiKey + "&part=snippet&fields=items(snippet)&id=";

const commUrlFunc = (apiKey) => "https://www.googleapis.com/youtube/v3/commentThreads?key=" +
    apiKey + "&textFormat=plainText&part=snippet&part=snippet&fields=items(snippet)&maxResults=3&videoId="

// const api_url = "https://yt.lemnoslife.com/noKey/videos?part=contentDetails&fields=items(contentDetails)&id=";
const api_url = apiUrlFunc(process.env.YOUTUBE_API_KEY);
const comment_api = commUrlFunc(process.env.YOUTUBE_API_KEY);

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

/*
function split_to_chunk2(arr, chunkSize) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
}
*/

const split_to_chunk = (list, size) => [...Array(Math.ceil(list.length / size))]
    .map((_, i) => list.slice(i * size, i * size + size));

function stringContainAnyWord(str, words) {
    for (const word of words) {
        if (str.includes(word)) {
            return true;
        }
    }
    return false;
}

async function process_videos(ids, processOne) {
    const chunks = split_to_chunk(ids, 50);
    let result = [];
    for (const chunk of chunks) {
        const url_to_fetch = api_url + chunk.join();
        const resp = await fetch(url_to_fetch).then((response) => response.json());
        for (const item of resp.items) {
            result = result.concat(processOne(item));
        }
    }
    return result;
}

async function parse_desc(ids, words) {
    const chunks = split_to_chunk(ids, 50);
    for (const chunk of chunks) {
        const url_to_fetch = api_url + chunk.join();
        const resp = await fetch(url_to_fetch).then((response) => response.json());
        // console.log(resp);
        if (!resp.items) {
            console.log(resp);
            return;
        }
        for (const item of resp.items) {
            const desc = item.snippet.description.toLowerCase();
            if (stringContainAnyWord(desc, words)) {
                console.log("parse_desc", item.snippet.title);
            }
        }
    }
}

function printWithLabel(label, words) {
    for (const word of words) {
        console.log(label, word);
    }
}

async function parse_desc2(ids, words) {
    const processOne = item => {
        const desc = item.snippet.description.toLowerCase();
        if (stringContainAnyWord(desc, words)) {
            return [item.snippet.title];
        }
        return [];
    };
    printWithLabel("parse_desc", await process_videos(ids, processOne));
}

async function parse_comment(ids, words) {
    const chunk = [];
    for (const id of ids) {
        const url_to_fetch2 = comment_api + id;
        const resp = await fetch(url_to_fetch2).then((response) => response.json());
        if (!resp.items) {
            console.log(resp);
            return;
        }
        for (const item of resp.items) {
            const desc = item.snippet.topLevelComment.snippet.textDisplay.toLowerCase();
            if (stringContainAnyWord(desc, words)) {
                // console.log(desc);
                chunk.push(id);
                break;
            }
        }
    }
    const processOne = item => [item.snippet.title];
    printWithLabel("parse_comment", await process_videos(chunk, processOne));
}


async function nataly() {
    const ids2 = lirycs.map(parse_id_from_line);
    const words = ["натали", "ветер"];
    await parse_desc2(ids2, words);
    await parse_comment(ids2, words);
}

async function ketchup() {
    const ids = longplay.map(parse_id_from_line);
    const words = ["ketchup", "кетчуп"];
    await parse_desc(ids, words);
    await parse_comment(ids, words);
}

async function strelki() {
    const ids = longplay.map(parse_id_from_line);
    const words = ["стрелки"];
    await parse_desc(ids, words);
    await parse_comment(ids, words);
}

strelki();
