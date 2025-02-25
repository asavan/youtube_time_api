import os from "os";

console.log([].concat(...Object.values(os.networkInterfaces())));
console.log("\n\n\n\n\n");
function getLocalExternalIP(defaultAddr) {
    const cand = Object.values(os.networkInterfaces()).
        flat().
        filter(a => a.family === "IPv4" && !a.internal).
        map(a => a.address);
    if (cand.length === 0) {
        return defaultAddr;
    }
    console.log(cand);
    return cand.slice(-1)[0];
}

console.log(getLocalExternalIP("0.0.0.0"));
