@echo off

if not exist "release_pkgs" mkdir "release_pkgs"

set APK_OUTPUT_PATH=platforms\android\app\build\outputs\apk

if exist %APK_OUTPUT_PATH%\release\app-release.apk (
    copy %APK_OUTPUT_PATH%\release\app-release.apk release_pkgs\MaxWallController.apk
)
if exist %APK_OUTPUT_PATH%\debug\app-debug.apk (
    copy %APK_OUTPUT_PATH%\debug\app-debug.apk release_pkgs\MaxWallController-Debug.apk
)