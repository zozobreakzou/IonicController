@echo off

echo install npm dependencies...
call npm install

echo adding platform android..., if firstly build, will take a long time
call ionic cordova platform remove android
call ionic cordova platform add android

if /i "%1" == "--debug" (
    if exist release_pkgs\MaxWallController-Debug.apk (
        del release_pkgs\MaxWallController-Debug.apk
    )
    echo starting build debug apk...
    call ionic cordova resources android
    call ionic cordova build android --debug
)else (
    if exist release_pkgs\MaxWallController.apk (
        del release_pkgs\MaxWallController.apk
    )
    echo starting build release apk...
    call ionic cordova resources android
    call ionic cordova build android --prod --release --buildConfig build\android\build.json
    echo upload the apk to pgyer.com
    call "build\android\curl.exe" -k -F "buildInstallType=2" -F "buildPassword=zozobreak" -F "file=@release_pkgs\MaxWallController.apk" -F "_api_key=67c6157ed64f57b6fefea8914a0841df" https://www.pgyer.com/apiv2/app/upload
    echo get and install the app from "https://www.pgyer.com/nxLm", password is "zozobreak"
)