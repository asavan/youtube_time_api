import {Agent, fetch, setGlobalDispatcher} from "undici";

setGlobalDispatcher(new Agent({connect: { timeout: 80_000 }}));

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

const split_to_chunk = (list, size) => [...Array(Math.ceil(list.length / size))].
    map((_, i) => list.slice(i * size, i * size + size));

async function process_chunks(api_url, ids, processOne) {
    const chunks = split_to_chunk(ids, 50);
    let result = [];
    for (const chunk of chunks) {
        const url_to_fetch = api_url + chunk.join();
        const resp = await fetch(url_to_fetch).then((response) => response.json());
        if (!resp.items) {
            console.log(resp);
            return result;
        }
        for (const item of resp.items) {
            result = result.concat(processOne(item));
        }
    }
    return result;
}

// const api_url = "https://yt.lemnoslife.com/noKey/videos?part=contentDetails&fields=items(contentDetails)&id=";

const snippetApiUrl = (apiKey) => "https://www.googleapis.com/youtube/v3/videos?key=" +
    apiKey + "&part=snippet&fields=items(snippet)&id=";

const commentApiUrl = (apiKey) => "https://www.googleapis.com/youtube/v3/commentThreads?key=" +
    apiKey + "&textFormat=plainText&part=snippet&fields=items(snippet)&maxResults=3&videoId=";

const nameAndDurationApi = (apiKey) => "https://www.googleapis.com/youtube/v3/videos?key=" +
    apiKey + "&part=contentDetails,snippet&fields=items(contentDetails,snippet)&id=";

const durationApi = (apiKey) => "https://www.googleapis.com/youtube/v3/videos?key=" +
    apiKey + "&part=contentDetails&fields=items(contentDetails)&id=";

export {
    process_chunks,
    snippetApiUrl,
    commentApiUrl,
    durationApi,
    nameAndDurationApi
};
