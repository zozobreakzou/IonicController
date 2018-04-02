#!/bin/sh

set -o errexit

BUILD_TYPE=release
DISTRIBUTE_TYPE=enterprise
BUILD_CONFIG=build_enterprise.json
IPA_PATH="release_pkgs/MaxWallController.ipa"

while [[ $# -gt 0 ]] ; do
        case "$1" in
                --debug) echo "debug" ; BUILD_TYPE=debug ;  IPA_PATH="release_pkgs/MaxWallController-Debug.ipa" ; shift ;;
                --app-store) echo "app-store" ; DISTRIBUTE_TYPE=app-store ; BUILD_CONFIG="build_appstore.json" ; shift ;;
                *) echo "unknown option." ; exit 1 ;;
        esac
done

if [[ -e $IPA_PATH ]]; then
    rm -f $IPA_PATH
fi

echo install npm dependencies...
npm install

echo adding platform ios..., if firstly build, will take a long time
ionic cordova platform remove ios
ionic cordova platform add ios

echo starting build $BUILD_TYPE $DISTRIBUTE_TYPE ipa...
ionic cordova resources ios

if [[ $BUILD_TYPE == "debug" ]]; then
    ionic cordova build ios --debug --device --buildConfig build/ios/$BUILD_CONFIG
else
    ionic cordova build ios --release --device --prod --buildConfig build/ios/$BUILD_CONFIG
fi

echo build ios ipa done.

if [[ $BUILD_TYPE == "release" && $DISTRIBUTE_TYPE == "enterprise" ]]; then
    echo upload the enterprise ipa to pgyer.com
    curl -F "buildInstallType=2" -F "buildPassword=zozobreak" -F "file=@$IPA_PATH" -F "_api_key=67c6157ed64f57b6fefea8914a0841df" https://www.pgyer.com/apiv2/app/upload
    echo get and install the app from "https://www.pgyer.com/e2Lh", password is "zozobreak"
fi
