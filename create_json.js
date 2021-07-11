const { resolve } = require("path");
const { readdirSync, writeFileSync } = require("fs");
const php_json = resolve(__dirname, "binarys.json")
var files = readdirSync("/tmp/Bins/")

// New JSON
var nwjson = {
    "linux": {
        "x64": null,
        "aarch64": null
    },
    "darwin": {
        "x64": null,
        "aarch64": null
    },
    "win32": {
        "x64": null,
        "aarch64": null
    },
    "android": {
        "aarch64": null,
        "x64": null
    },
    "other": []
};

// Organizing the JSON
for (let index of files){
    const DownloadURL = `https://github.com/The-Bds-Maneger/Raw_files/releases/download/${process.env.tag_name}/${index}`;
    console.log(DownloadURL);
    // Windows
    if (/[Ww]indows/.test(index)){
        if (/x64/.test(index)) {
            if (!(nwjson.win32.x64)) nwjson.win32.x64 = DownloadURL; else nwjson.other.push(DownloadURL);
        } else if (/aarch64/.test(index)) {
            if (!(nwjson.win32.aarch64)) nwjson.win32.aarch64 = DownloadURL; else nwjson.other.push(DownloadURL)
        } else nwjson.other.push(DownloadURL)
    }
    // Linux
    else if (/[Ll]inux/.test(index)){
        if (/x64/.test(index)) {
            if (!(nwjson.linux.x64)) nwjson.linux.x64 = DownloadURL; else nwjson.other.push(DownloadURL);
        } else if (/aarch64/.test(index)) {
            if (!(nwjson.linux.aarch64)) nwjson.linux.aarch64 = DownloadURL; else nwjson.other.push(DownloadURL)
        } else nwjson.other.push(DownloadURL)
    }
    // MacOS
    else if (/[Mm]ac[Oo][Ss]/.test(index)){
        if (/x64/.test(index)) {
            if (!(nwjson.darwin.x64)) nwjson.darwin.x64 = DownloadURL; else nwjson.other.push(DownloadURL);
        } else if (/aarch64/.test(index)) {
            if (!(nwjson.darwin.aarch64)) nwjson.darwin.aarch64 = DownloadURL; else nwjson.other.push(DownloadURL)
        } else nwjson.other.push(DownloadURL)
    }
    // Android
    else if (/[Aa]ndroid/.test(index)){
        if (/x64/.test(index)) {
            if (!(nwjson.android.x64)) nwjson.android.x64 = DownloadURL; else nwjson.other.push(DownloadURL);
        } else if (/aarch64/.test(index)) {
            if (!(nwjson.android.aarch64)) nwjson.android.aarch64 = DownloadURL; else nwjson.other.push(DownloadURL)
        } else nwjson.other.push(DownloadURL)
    }
    // Others
    else nwjson.other.push(DownloadURL);
}
console.log(nwjson);
writeFileSync(php_json, JSON.stringify(nwjson, null, 2))
