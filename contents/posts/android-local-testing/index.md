---
date: 2013-04-29
title: Android Local Testing
description: Setup your Android device or emulator for web development testing.
template: post.jade
---

1. Start the adb server.

    ```bash
    sudo adb start-server
    ```

2. Ensure that your device is in developer mode over USB and connected.

    > If you're using the Android SDK/AVD then it will automatically be connected and show as emulator-{id}.

    ```bash
    adb devices
    List of devices attached
    {YOURDEVICEID}	device
    ```

3. Mount the system as read-write, so you can edit the host file.

    ```bash
    # If you're using an emulator:
    adb remount

    # Continue with the following for both emulator and native device:
    adb shell

    # If you're using an emulator:
    echo '10.0.2.2 dev.yoursite.com' >> /etc/hosts

    # If you're using native device:
    mount -o rw,remount /system
    echo '192.168.12.34 dev.yoursite.com' >> /etc/hosts

    exit
    ```

4. Fire up <http://dev.yoursite.com> on your Android device and test your site locally.
