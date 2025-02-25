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

function full_url(id) {
    return "https://www.youtube.com/watch?v=" + id;
}

export {
    full_url,
    parse_id_from_line,
    parse_short_id_from_line
};
