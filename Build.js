const Windows = require("./targets/win32_x64");
const MacOS = require("./targets/mac_x64-aarch64");
const Linux = require("./targets/linux_aarch64-x64");
const Android = require("./targets/android_aarch64");
(async () => {
    // Linux and Android
    if (process.platform === "linux"){
        try {
            await Linux.Linux()
            await Android.MuslBuildInstall();
            await Android.android_aarch64();
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    } else if (process.platform === "darwin") {
        try {
            await MacOS.Mac_Intel();
            await MacOS.Mac_aarch64();
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    } else if (process.platform === "win32") {
        try {
            await Windows.win32_x64();
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    } else process.exit(210)
})()