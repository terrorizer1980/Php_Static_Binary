const child_process = require("child_process");
const path = require("path");
const adm_zip = require("adm-zip");
const os = require("os");

//Set Build Function
exports.Linux = async function Linux() {
    return new Promise((resolve, reject) => {
        // Setup PHP Build
        let BuildScript = path.resolve(__dirname, "../php_build/compile.sh");
        const linux_build = child_process.execFile(BuildScript, [`-j${os.cpus().length}`], {
            cwd: path.resolve(__dirname, "../php_build")
        });
        linux_build.stdout.on("data", data => process.stdout.write(data));
        linux_build.stderr.on("data", data => process.stdout.write(data));
        linux_build.on("exit", code => {
            if (code === 0) {
                // Create Zip
                const linux_zip = new adm_zip();
                linux_zip.addLocalFolder(path.resolve(__dirname, "../php_build/bin"), "/bin");

                // Create Zip file
                let OutFile = path.resolve(__dirname, `Linux_${process.arch}_php.zip`);
                linux_zip.writeZip(OutFile);
                resolve(OutFile);
            } else {
                reject();
            }
        });
    });
}