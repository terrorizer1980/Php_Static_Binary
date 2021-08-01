const child_process = require("child_process");
const path = require("path");
const adm_zip = require("adm-zip");

exports.win32_x64 = async function win32_x64() {
    return new Promise((resolve, reject) => {
        const windows_build = child_process.exec("windows-compile-vs.bat", {cwd: path.resolve(__dirname, "../php_build")});
        windows_build.stdout.on("data", data => process.stdout.write(data));
        windows_build.stderr.on("data", data => process.stdout.write(data));
        windows_build.on("exit", code => {
            if (code === 0) {
                // Create zip file
                const windows_zip = new adm_zip();
                windows_zip.addLocalFolder(path.resolve(__dirname, "./php_build/bin/"), "/bin");

                // Write zip files
                let outZip = path.resolve(__dirname, "Windows_x64_php.zip");
                windows_zip.writeZip(outZip);
                resolve(outZip);
            } else {
                reject("Could not compile php for Windows, code: "+code);
            }
        });
    });
}