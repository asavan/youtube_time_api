import {open} from "node:fs/promises";
import {promisify} from "node:util";
import {execFile} from "node:child_process";

import {allReaderBinded} from "./all_reader.js";
import {full_url} from "./youtube_url.js";

const execFilePromise = promisify(execFile);

async function extractVideoIds3(filename) {
    const file = await open(filename);
    const videoIds = [];

    try {
        for await (const line of file.readLines()) {
            const trimmedLine = line.trim();

            const closeBracketIdx = trimmedLine.lastIndexOf(']');
            const openBracketIdx = trimmedLine.lastIndexOf('[', closeBracketIdx);

            if (openBracketIdx !== -1 && closeBracketIdx !== -1 && closeBracketIdx > openBracketIdx) {
                const videoId = trimmedLine.substring(openBracketIdx + 1, closeBracketIdx);
                if (videoId) {
                    videoIds.push(videoId);
                }
            }
        }
    } finally {
        await file?.close();
    }
    return videoIds;
}

async function extractVideoIds4(bigString) {
    const videoIds = [];

    for (const line of bigString.split("\n")) {
        const trimmedLine = line.trim();
        if (trimmedLine === "") {
            continue;
        }

        const closeBracketIdx = trimmedLine.lastIndexOf(']');
        const openBracketIdx = trimmedLine.lastIndexOf('[', closeBracketIdx);

        if (openBracketIdx !== -1 && closeBracketIdx !== -1 && closeBracketIdx > openBracketIdx) {
            const videoId = trimmedLine.substring(openBracketIdx + 1, closeBracketIdx);
            if (videoId) {
                videoIds.push(videoId);
            }
        }
    }

    return videoIds;
}

function getDifference(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
}

function getDailyNotePath(prefix, date = new Date()) {
    const dateStr = date.toLocaleDateString('en-CA');
    return `${prefix}${dateStr}.md`;
}

async function runAdbCommand(additionalParams) {
    const args = [];
    if (process.env.ANDROID_DEVICE_ID) {
        args.push("-s");
        args.push(process.env.ANDROID_DEVICE_ID);
    }
    if (additionalParams) {
        for (const param of additionalParams) {
            args.push(param);
        }
    }
    const {stdout, stderr} = await execFilePromise(process.env.ADB_LOCATION || "adb", args);

    if (stderr) {
        console.warn(stderr);
    }
    return stdout;
}

async function main() {
    try {
        const args = [];
        args.push("shell");
        args.push("ls");
        args.push(process.env.ANDROID_FOLDER);

        const stdout= await runAdbCommand(args);
        const ids = await extractVideoIds4(stdout);
        if (ids.length === 0) {
            console.log("Корзина пуста");
            return;
        }

        const file = process.argv[2] || getDailyNotePath(process.env.OBSIDIAN_DAILY_FOLDER);
        const mask = Number.parseInt(process.argv[3]) || 3;
        const reader = allReaderBinded(mask);
        const idsToday = await reader(file);

        console.log(`Найдено: ${ids.length} файлов в корзине и ${idsToday} файлов в заметке`);

        const idsNotToday = getDifference(ids, idsToday);
        console.log('Список после очистки:', idsNotToday);
        if (idsNotToday.length === 0) {
            // clear trash
            const args = [];
            args.push("shell");
            args.push("rm");
            args.push(process.env.ANDROID_FOLDER + "/*");
            const stdout = await runAdbCommand(args);
            console.log(stdout);
            return;
        }
        const linksNotToday = idsNotToday.map(full_url);
        console.log(linksNotToday.join('\n'));

    } catch (error) {
        console.error(error);
    }
}

main();
