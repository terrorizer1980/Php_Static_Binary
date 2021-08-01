const child_process = require("child_process");
const path = require("path");
const adm_zip = require("adm-zip");
const os = require("os");

exports.MuslBuildInstall = async function MuslBuildInstall(){
    return new Promise((resolve, reject) => {
        const musl_install = child_process.execFile("sudo", ["bash", path.resolve(__dirname, "../PreInstall/musl-cross.sh")], {maxBuffer: Infinity});
        musl_install.stdout.on("data", data => process.stdout.write(data));
        musl_install.stderr.on("data", data => process.stdout.write(data));
        musl_install.on("exit", code => {if (code === 0) resolve(); else reject(code)});
    });
}

exports.android_aarch64 = async function android_aarch64() {
    return new Promise((resolve, reject) => {
        const android_build = child_process.execFile(path.resolve(__dirname, "../php_build/compile.sh"), ["-t", "android-aarch64", "-x", "-f", `-j${os.cpus().length}`], {
            cwd: path.resolve(__dirname, "../php_build")
        });
        android_build.stdout.on("data", data => process.stdout.write(data));
        android_build.stderr.on("data", data => process.stdout.write(data));
        android_build.on("exit", code => {
            if (code === 0) {
                const android_zip = new adm_zip();
                android_zip.addLocalFolder(path.resolve(__dirname, "../php_build/bin"), "/bin");

                // Write the zip file
                let OutZip = path.resolve(__dirname, "../Android_aarch64_php.zip");
                android_zip.writeZip(OutZip);
                resolve(OutZip);
            } else reject("Couldn't compile php for Android, code: "+code);
        });
    });
}