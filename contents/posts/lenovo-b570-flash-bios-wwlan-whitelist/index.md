---
date: 2013-09-07
title: Lenovo B570 Flash Bios for WWLAN Whitelisting
description: Flash your B570's bios to allow complete WWLAN whitelisting.
template: post.jade
---

**NOTE**: I'm not responsible for damages of your system and not responsible for any consequence as a result of BIOS updates and/or following these instructions.  These instructions were mainly documented for my own practice.

1. Download BIOS mod: <http://www.bios-mods.com/forum/Thread-Removed-44CN43WW-Lenovo-B570-1068A8U-Whitelist-Mod-Request?page=2&highlight=44CN43WW>.

    > Here is a direct link as of 09/07/2013: <http://dl.dropbox.com/u/45117524/bios-mods.com/44CN43WW_NWL_DOS_ByCamiloml.exe>

2. Extract the ".exe" file previously downloaded.  Insert a USB flash drive and copy the extracted contents to the root of the flash drive.

3. Download Ultimate Boot CD ISO: <http://www.ultimatebootcd.com/>

4. Burn the ISO to a CD-ROM using Brasero: <https://projects.gnome.org/brasero/>

    > You can also install Brasero with:

    ```bash
    sudo apt-get install brasero
    ```

5. Ensure your AC power cord, burned CD-ROM, and USB flash drive are inserted into your computer.

6. Reboot your computer and hit F12 at the boot screen.  Select CD-ROM as your boot device.

7. Once UBCD starts, select "FreeDOS" option, and then "1".  Once you get to the menu, select "Exit" and hit enter.

8. At the command prompt enter the following commands:

    ```bash
    CDD C:
    SCT.bat
    ```

9. Your computer will flash its BIOS now and after it finishes you can insert any WLAN card to the mini PCI-E slot (replacing the existing BCM4313 card).

    > I found that AR5B22 cards work great and you can buy them off eBay for ~$6 USD.

### Notes:

Thanks to Camilo M.L. ([@RastaMan_SP](https://twitter.com/RastaMan_Sp)) for the BIOS mod request.
