@echo off

echo adding platform android..., if firstly build, will take a long time
call ionic cordova platform add android

if /i "%1" == "--debug" (
    if exist release_pkgs\MaxWallController-Debug.apk (
        del release_pkgs\MaxWallController-Debug.apk
    )
    echo starting build debug apk...
    call ionic cordova build android --debug
)else (
    if exist release_pkgs\MaxWallController.apk (
        del release_pkgs\MaxWallController.apk
    )
    echo starting build release apk...
    call ionic cordova build android --prod --release --buildConfig build\android\build.json
)