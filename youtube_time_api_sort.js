
import {toHHMMSS} from "./time.js";
import {parse_one_file_duration} from "./youtube_duration.js";
import {allReaderBinded} from "./all_reader.js";
import {nameAndDurationApi} from "./youtube_api.js";

async function main() {
    console.log(process.argv);
    const file = process.argv[2] || "C:\\obsidian\\obsidian\\todo\\посмотреть.md";
    const mask = parseInt(process.argv[3]) || 3;
    const limit = parseInt(process.argv[4]) || 10;
    const reader = allReaderBinded(mask);
    const api_url = nameAndDurationApi(process.env.YOUTUBE_API_KEY);
    const res = await parse_one_file_duration(api_url, file, reader);

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
        sort(([, a], [, b]) => -(a-b)).
        map(([n, a]) => ([n, toHHMMSS(a)]));

    const names = firstK.map(e => e.snippet.title + " " + toHHMMSS(e.seconds));

    console.log(names);
    console.log(sortable);

    const allTime = firstK.map(e => e.seconds).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(toHHMMSS(allTime));
}

main();
