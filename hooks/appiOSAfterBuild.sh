# !/bin/sh

mkdir -p release_pkgs

IPA_OUTPUT_PATH=platforms/ios/build/device/MaxWall.ipa

if [[ -e $IPA_OUTPUT_PATH ]]; then
    cp -f $IPA_OUTPUT_PATH release_pkgs/MaxWallController.ipa
fi
