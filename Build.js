const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const adm_zip = require("adm-zip")

// Log
function log(data = ""){
    data = data.split("\n").filter(a=>a)
    for (let a of data)console.log(a)
}

// Linux and Android
if (process.platform === "linux"){
    // Linux X64 Build
    const linux_build = child_process.execFile(path.resolve(__dirname, "./php_build/compile.sh"), [`-j${os.cpus().length}`], {
        cwd: path.resolve(__dirname, "./php_build")
    });
    linux_build.stdout.on("data", log);
    linux_build.stderr.on("data", log);
    linux_build.on("exit", code => {
        if (code === 0) {
            // Create Zip
            const linux_zip = new adm_zip();
            linux_zip.addLocalFolder(path.resolve(__dirname, "./php_build/bin"), "/bin");
            linux_zip.writeZip(path.resolve(__dirname, "Linux_x64_php.zip"));
            // Remove Bin
            fs.rmSync(path.resolve(__dirname, "./php_build/bin"), {force: true, recursive: true})
            const musl_install = child_process.execFile("sudo", ["bash", path.resolve(__dirname, "./PreInstall/musl-cross.sh")], {maxBuffer: Infinity});
            musl_install.stdout.on("data", log);
            musl_install.stderr.on("data", log);
            musl_install.on("exit", code => {
                if (code === 0) {
                    const android_build = child_process.execFile(path.resolve(__dirname, "./php_build/compile.sh"), [
                        "-t",
                        "android-aarch64",
                        "-x",
                        "-f",
                        `-j${os.cpus().length}`,
                    ],
                    {
                        cwd: path.resolve(__dirname, "./php_build")
                    });
                    android_build.stdout.on("data", log)
                    android_build.stderr.on("data", log)
                    android_build.on("exit", code => {
                        if (code === 0) {
                            const android_zip = new adm_zip();
                            android_zip.addLocalFolder(path.resolve(__dirname, "./php_build/bin"), "/bin");
                            android_zip.writeZip(path.resolve(__dirname, "Android_aarch64_php.zip"));
                            process.exit(0);
                        } else {
                            log("Couldn't compile php for Android, code: "+code)
                        }
                    })
                } else {
                    log("Unable to install musl to compile php for android, exit code: "+code);
                    process.exit(code);
                }
            });
        } else {
            log("We had a problem compiling PHP X64, code: "+code);
            process.exit(code)
        }
    });
} else if (process.platform === "darwin") {
    // MacOS Set Paths
    process.env.PATH = "/usr/local/opt/bison/bin:" + process.env.PATH
    process.env.LDFLAGS = "-L/usr/local/opt/bison/lib"

    // Build php
    const macos_build = child_process.execFile(path.resolve(__dirname, "./php_build/compile.sh"), [
        "-t",
        "mac64",
        `-j${os.cpus().length}`,
        "-u",
        "-g",
        "-l"
    ], {cwd: path.resolve(__dirname, "./php_build")});
    macos_build.stdout.on("data", log);
    macos_build.stderr.on("data", log);
    macos_build.on("exit", code => {
        if (code === 0) {
            const macos_zip = new adm_zip();
            macos_zip.addLocalFolder(path.resolve(__dirname, "./php_build/bin"), "/bin");
            macos_zip.writeZip(path.resolve(__dirname, `MacOS_${process.arch}_php.zip`))
        } else {
            log("Could not compile php for MacOS");
            process.exit(code)
        }
    })
} else if (process.platform === "win32") {
    const windows_build = child_process.exec("windows-compile-vs.bat", {cwd: path.resolve(__dirname, "./php_build")});
    windows_build.stdout.on("data", log);
    windows_build.stderr.on("data", log);
    windows_build.on("exit", code => {
        if (code === 0) {
            const windows_zip = new adm_zip();
            windows_zip.addLocalFolder(path.resolve(__dirname, "./php_build/bin/"), "/bin");
            windows_zip.writeZip(path.resolve(__dirname, `Windows_${process.arch}_php.zip`))
        } else {
            log("Could not compile php for Windows");
            process.exit(code);
        }
    });
} else process.exit(210)
