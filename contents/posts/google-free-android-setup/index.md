---
date: 2018-10-30
title: Google-free Android Setup
description: An easy to follow back-up and install guide using LineageOS (complete with recommended applications, Google app alternatives, pro-tips, and more!
template: post.jade
---

## Table of Contents

* [Disclaimer](#disclaimer)
* [Back-up Your Device](#back-up-your-device)
* [Install Requirements](#install-requirements)
* [Recommended Applications](#recommended-applications)
  * [Navigation](#navigation)
  * [Email](#email)
  * [Security & Password Management](#security--password-management)
  * [Tools, Messaging, & Entertainment](#tools-messaging--entertainment)
  * [Networking](#networking)
* [Pro-Tips](#pro-tips)
  * [If you get stuck, search on XDA](#if-you-get-stuck-search-on-xda)
  * [How to back-up SMS messages](#how-to-back-up-sms-messages)
  * [Want to go Google-free on your Mac](#want-to-go-google-free-on-your-mac)
  * [Sharing a link from your computer to your phone](#sharing-a-link-from-your-computer-to-your-phone)
  * [Opt-out of Google Location services on your Network Router](#opt-out-of-google-location-services-on-your-network-router)
  * [Adjust captive portal detection](#adjust-captive-portal-detection)
* [Additional Reading](#additional-reading)


## Disclaimer

I am in no way responsible for damage to your phone or other problems caused as a result of this article.  By modifying your phone you are doing so at your own risk.  Please be careful!

If you do run into issues, feel free to [email me](mailto:niftylettuce@gmail.com) and I can try to help, but please note that I have limited time and I may not be able to respond.


## Back-up Your Device

Unless you have a fresh device, I highly recommend backing up photos, pictures, messages, videos, contacts and other items that you may not already have a back-up of somewhere.

There are two ways to do so (and I strongly recommend doing both):

1. Manually over a USB cable using [Android File Transfer](https://www.android.com/filetransfer/)
2. Using a tool called TWRP (instructions are included for doing a full system back-up below under [Install Requirements](#install-requirements))

Additionally, I recommend to write down a list of your favorite apps that you have installed on a notepad somewhere.


## Install Requirements

I currently recommend using LineageOS as an alternative to the stock Android operating system.  LineageOS is a free and open-source operating system for smartphones and tablet computers, based on the Android mobile platform.

In order to install the operating system, please follow the steps below:

1. Install ADB and fastboot by following the instructions at: <https://wiki.lineageos.org/adb_fastboot_guide.html>
2. Download the latest version of TWRP recovery **for your specific device** at: <https://twrp.me/Devices/> (sometimes you may need to actually use an older version, e.g. if you are unable to boot into recovery mode, but first try the latest if possible)
3. Download the latest version of LineageOS **for your specific device** at: <https://download.lineageos.org>
4. Unlock your phone's bootloader at: <https://wiki.lineageos.org/devices/bacon/install>
5. Boot into the bootloader with `adb`:

   > Run this command from your terminal or command prompt:

   ```sh
   adb reboot bootloader
   ```
6. Install TWRP (recovery management software) with `fastboot`:

   > Be sure to replace "path/to/twrp.bacon.img" in the script below with the path to the file you downloaded in step 2 above
   >
   > Run this command from your terminal or command prompt:

   ```sh
   fastboot flash recovery path/to/twrp.bacon.img
   ```
7. If you are still in fastboot menu, use the volume up and down keys to select "Recovery mode" and then hit the power button to select it.  Otherwise you will need to boot into recovery mode by pressing and holding down the volume down and power button for a few seconds  – may vary depending on what your device is; you can search on [DuckDuckGo](https://duckduckgo.com) for your device's shortcut if necessary)
8. Make a back-up with TWRP at: <https://www.howtogeek.com/240582/how-to-back-up-and-restore-your-android-phone-with-twrp/>
9. Pull the recovery backup ZIP off the phone using `adb`:

   > Be sure to replace "/sdcard/path-to-backup.zip" with the path to the back-up on your phone and "my-backup.zip" with the path to where you'd like to store the file locally on your computer
   >
   > Run this command from your terminal or command prompt:

   ```sh
   adb pull /sdcard/path-to-backup.zip my-backup.zip
   ```
10. Repeat step 7 above
11. Under the recovery mode menu, navigate to `Wipe` and then run a `Factory Reset`
12. While in recovery mode, push the LineageOS ROM to your phone:

    > Be sure to replace "path/to/lineage.zip" in the script below with the path to the file you downloaded in step 3 above
    >
    > Run this command from your terminal or command prompt:

    ```sh
    adb push path/to/lineage.zip /sdcard/
    ```
13. Under the recovery mode menu, navigate to `Install` and select the file you just pushed inside the `/sdcard/` folder
14. (Optional) Root the device by installing the `arm` SU add-on at: <https://download.lineageos.org/extras> (you'll push it to `/sdcard/` and then install it similarly LineageOS in step 13)
15. Reboot the device (if you're in Recovery mode, go to `Reboot` and then tap `System`)
16. Install [F-Droid](https://f-droid.org/)
17. Install your preferred applications from [Recommended Applications](#recommended-applications) below


## Recommended Applications

All of the applications listed below are Google-free alternatives and/or useful applications that I highly recommend.

If you're looking for a Google-free alternative to a favorite app of yours, please [email me](mailto:niftylettuce@gmail.com) and I'd be glad to help.

### Navigation

* [OsmAnd+](https://f-droid.org/en/packages/net.osmand.plus/) for navigation and directions using OpenStreetMap data (an alternative to Google Maps)
* [SatStat](https://f-droid.org/en/packages/com.vonglasow.michael.satstat/) for viewing satellite, GPS, and other sensor data

### Email

* [K-9 Mail](https://f-droid.org/packages/com.fsck.k9/) for receiving email from multiple accounts with support for OpenPGP encryption (an alternative to Gmail)
* [ForwardEmail](https://forwardemail.net) for private, encrypted, and free email forwarding (I made this – it's an alternative to Google Business)

### Security & Password Management

* [FreeOTP](https://f-droid.org/en/packages/org.fedorahosted.freeotp/) for two-factor authentication (2FA) token management (an alternative to Google Authenticator)
* [SnoopSnitch](https://f-droid.org/en/packages/de.srlabs.snoopsnitch/) for checking mobile network security
* [FlowCrypt](https://flowcrypt.com/download) for PGP encryption (not on F-Droid)
* [OpenKeychain](https://f-droid.org/en/packages/org.sufficientlysecure.keychain/) for encrypting files and communications (OpenPGP compliant and pairs well with K-9 mail)
* [Skimmer Scanner](https://play.google.com/store/apps/details?id=skimmerscammer.skimmerscammer&hl=en_US) ([not yet](https://gitlab.com/fdroid/rfp/issues/353) on F-Droid, but you can download APK using Yalp Store, see below)
* [AdAway](https://f-droid.org/en/packages/org.adaway/) for blocking ads, uses hosts file (requires root, see step 14 above in [Install Requirements](#install-requirements))

### Tools, Messaging, & Entertainment

* [AnySoftKeyboard](https://f-droid.org/en/packages/com.menny.android.anysoftkeyboard/) for an on-screen keyboard (an alternative to Google Keyboard and Android's stock keyboard)
* [QKSMS](https://f-droid.org/packages/com.moez.QKSMS/) for SMS messaging (an alternative to Android's stock Messenger and Google Hangouts)
* [Firefox Klar](https://f-droid.org/en/packages/org.mozilla.klar/) for private browsing with ad-blocking and web-tracking blocking support (an alternative to Google Chrome and Android's stock browser)
* [Transistor](https://f-droid.org/en/packages/org.y20k.transistor/) for listening to radio streams over the internet
* [Etar](https://f-droid.org/en/packages/ws.xsoh.etar/) for calendar management (an alternative to Google Calendar)
* [Vinyl Music Player](https://www.f-droid.org/en/packages/com.poupa.vinylmusicplayer/) for listening to music (an alternative to Android's stock music player and Google Music)
* [Lawnchair](https://f-droid.org/en/packages/ch.deletescape.lawnchair.plah/) for a better launcher with customizability (an alternative to Android's stock launcher)
* [Open Camera](https://f-droid.org/en/packages/net.sourceforge.opencamera/) for taking pictures, video, and more (an alternative to Android Camera and Google's Camera)
* [SecScanQR](https://f-droid.org/en/packages/de.t_dankworth.secscanqr/) for QR code scanning and generation (secure and private alternative)
* [Password Store](https://f-droid.org/packages/com.zeapo.pwdstore/) for simple password management, built on top of [pass](https://www.passwordstore.org/) – you may also want to use [pass-import](https://github.com/roddhjav/pass-import) (an alternative to Google Sync)
* [NewPipe](https://f-droid.org/en/packages/org.schabi.newpipe/) for viewing YouTube videos (an alternative to YouTube)
* [Easer](https://f-droid.org/en/packages/ryey.easer/) for event-driven Android automation
* [Termux](https://f-droid.org/en/packages/com.termux/) for a terminal emulator with SSH support and more
* [Night Screen](https://f-droid.org/en/packages/info.papdt.blackblub/) for adjusting brightness and screen color to prevent eye-strain
* [Yalp Store](https://f-droid.org/en/packages/com.github.yeriomin.yalpstore/) for downloading apps directly from Google Play Store as APK files (alternative to Google Play Store)
* [Slide](https://f-droid.org/en/packages/me.ccrama.redditslide/) for browsing Reddit
* [Omni Notes](https://f-droid.org/en/packages/it.feio.android.omninotes.foss/) for taking notes (an alternative to Google Keep)

### Networking

* [OpenVPN](https://f-droid.org/en/packages/de.blinkt.openvpn/) for virtual private network ("VPN")


## Pro-Tips

### If you get stuck, search on XDA

Do a search on DuckDuckGo for "xda lineageos $deviceName $yourProblem".  You should generally find a solution.

For example, you might need to completely re-flash firmware, radio, and bootloader depending on your device.  I had to do this with a Nexus 5X and followed this thread here for my issue <https://forum.xda-developers.com/nexus-5x/orig-development/rom-lineageos-15-1-nexus-5x-bullhead-t3724575>.  I found this thread by searching "nexus 5x lineageos xda".

### How to back-up SMS messages

Simply install QKSMS (see link above), and in the app first sync with native messages, then go to `Backup and restore`, click on "Backup now", and then `adb pull /sdcard/QKSMS some-local-path` (replace "some-local-path" with where you want to save the back-up locally).  Later once you're done with all the steps above, you can `adb push some-local-path /sdcard/QKSMS-backup`, re-open the QKSMS app after installing it, and restore from back-up.

### Want to go Google-free on your Mac

Send me [an email](mailto:niftylettuce@gmail.com) and I'll ping you back once my article for that is up.

### Sharing a link from your computer to your phone

From your computer, simply copy the link to your clipboard, go to <https://duckduckgo.com>, and search for `!qr <insert link here>`.  DuckDuckGo will automatically generate a QR code you can scan with your phone using SecScanQR (a QR code app listed above).

### Opt-out of Google Location services on your Network Router

See <https://support.google.com/maps/answer/1725632?hl=en>.  You will need to affix your router's SSID name with `_nomap`.

### Adjust captive portal detection

You may also wish to disable [captive portal detection](https://en.wikipedia.org/wiki/Captive_portal) or change the default from Google's servers.  **Do not do this unless you are highly technical and understand the implications of doing this.  Disabling captive portal will most likely disable your device from working at airports, coffee shops, and at public wi-fi hotspots.**

This assumes you have Android Debugging Mode turned on and Developer Mode enabled: <https://www.digitaltrends.com/mobile/how-to-get-developer-options-on-android/>

> Note you will need to reboot your device after running the below commands:

To disable:

```sh
adb shell
settings put global captive_portal_mode 0
settings delete global captive_portal_mode
```

Or, to re-enable:

```sh
adb shell
settings put global captive_portal_mode 1
```


## Additional Reading

* [Open GApps](https://opengapps.org/) – not Google-free, but allows you to install Google Play Store and download apps from the app store
* [microG Project](https://microg.org/) – a free-as-in-freedom re-implementation of Google's proprietary Android user space apps and libraries
* [LineageOS for microG](https://lineage.microg.org/) – access all the Google services without proprietary closed software
* [Google Free Android](https://verummeum.com/blog/2018/09/30/google-free-android/) – another similar blog post to this
* [How to Android without Google (easy way)](https://bytemybits.gitlab.io/post/2018-05-23-how-to-android-without-google-easy-way/)
* [How to Android without Google (hard way)](https://bytemybits.gitlab.io/post/2018-05-23-how-to-android-without-google-hard-way/)
