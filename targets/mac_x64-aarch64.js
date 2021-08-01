const child_process = require("child_process");
const path = require("path");
const adm_zip = require("adm-zip");
const os = require("os");

// Mac Intel
exports.Mac_Intel = async function Mac_Intel() {
    return new Promise((resolve, reject) => {
        // MacOS Set Paths
        process.env.PATH = "/usr/local/opt/bison/bin:" + process.env.PATH
        process.env.LDFLAGS = "-L/usr/local/opt/bison/lib"

        // Build php
        const macos_build = child_process.execFile(path.resolve(__dirname, "../php_build/compile.sh"), ["-t", "mac-x86-64", `-j${os.cpus().length}`, "-u", "-g", "-l"], {
            cwd: path.resolve(__dirname, "../php_build")
        });
        macos_build.stdout.on("data", data => process.stdout.write(data));
        macos_build.stderr.on("data", data => process.stdout.write(data));
        macos_build.on("exit", code => {
            if (code === 0) {
                // Create zip file
                const macos_zip = new adm_zip();
                macos_zip.addLocalFolder(path.resolve(__dirname, "../php_build/bin"), "/bin");

                // Write zip file
                let OutZip = path.resolve(__dirname, "../MacOS_x64_php.zip");
                macos_zip.writeZip(OutZip);
                resolve(OutZip);
            } else {
                reject("Could not compile php for MacOS, code: "+code);
            }
        });
    });
}

// Mac ARMs
exports.Mac_aarch64 = async function Mac_aarch64() {
    return new Promise((resolve, reject) => {
        // MacOS Set Paths
        process.env.PATH = "/usr/local/opt/bison/bin:" + process.env.PATH
        process.env.LDFLAGS = "-L/usr/local/opt/bison/lib"

        // Build php
        const macos_build = child_process.execFile(path.resolve(__dirname, "../php_build/compile.sh"), ["-t", "mac-arm64", `-j${os.cpus().length}`, "-u", "-g", "-l"], {
            cwd: path.resolve(__dirname, "../php_build")
        });
        macos_build.stdout.on("data", data => process.stdout.write(data));
        macos_build.stderr.on("data", data => process.stdout.write(data));
        macos_build.on("exit", code => {
            if (code === 0) {
                // Create zip file
                const macos_zip = new adm_zip();
                macos_zip.addLocalFolder(path.resolve(__dirname, "../php_build/bin"), "/bin");

                // Write zip file
                let OutZip = path.resolve(__dirname, "../MacOS_x64_php.zip")
                macos_zip.writeZip(OutZip);
                resolve(OutZip);
            } else {
                reject("Could not compile php for MacOS, code: "+code);
            }
        });
    });
}