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

function wrapper(url) {
    return "```vid\n" + url + "\n```\n";
}

export {
    isTask,
    extractUrlFromMdLink,
    wrapper
};
