---
date: 2013-09-07
title: How to run multiple Dropbox instances on Ubuntu/Debian/Linux Mint.
description: Easily add multiple dropbox accounts to start up applications on Linux.
template: post.jade
---

1. Create as many Dropbox accounts as you like on [Dropbox](http://db.tt/2ZTl6efc).

2. Install Dropbox using your respective package at: <https://www.dropbox.com/install?os=lnx>

    > You can also use the PPA:

    ```bash
    sudo apt-get install dropbox
    ```

3. Add to startup applications (Menu &rarr; Preferences &rarr; Startup Applications) the following script per account:

    ```bash
    HOME=~/.dropbox-some-alias dropbox start -i
    ```

    > If you have (3) Dropbox accounts, you would add one per account, changing the "some-alias" part.

4. After you reboot your computer, you will be prompted to log in to the respective Dropbox accounts.

5. Note that your Dropbox folders are accessible under `~/.dropbox-some-alias`, so you could add Bookmarks or hotkeys to open them.
