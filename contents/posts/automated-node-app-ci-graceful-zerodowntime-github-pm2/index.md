---
date: 2016-04-14
title: Automated Continuous Integration Setup for Graceful and Zero-Downtime Node App Deployment using GitHub, PM2, Digital Ocean, and SemaphoreCI
description: How-to set up automated continuous integration and deployment setup with graceful and zero-downtime restarts for Node.js using GitHub, PM2, Digital Ocean, and SemaphoreCI.
template: post.jade
---

> **tldr;** This article shows you how to configure an insanely simple
automated continuous integration and deployment setup for a [Node.js][nodejs]
app using [GitHub][github], [PM2][pm2], [Digital Ocean][digital-ocean], and
[SemaphoreCI][semaphoreci].  I wrote it because nothing like this in its
entirety exists.  It should take you 30 minutes to set up properly.

![CI PM2 Node GitHub Server Setup][ci-pm2-setup-image]

## Index

* [Preface](#preface)
* [1. Create your Droplet](#1-create-your-droplet)
* [2. Write your Node App File](#2-write-your-node-app-file)
* [3. Set up SSH for SemaphoreCI](#3-set-up-semaphoreci)
* [4. Add new GitHub Deployment Key](#4-add-new-github-deployment-key)
* [5. Share /var/www Access](#5-share-varwww-access)
* [6. Configure PM2 for Deployment](#6-configure-pm2-for-deployment)
* [7. PM2 Deployment Commands](#7-pm2-deployment-commands)
* [Notes](#notes)


## Preface

I've used or explored nearly every CI testing tool there is for Node.js
(maybe?). I have tried [TravisCI][travis], but grew tired of constant downtime
and slow, very slow build times (...OK, the builds ran fast, but they did not
kick off quickly!). Also I've tried [CircleCI][circle], but their founders
[removed my][cci-removal] thoughts from their community because they didn't
agree to allow the file name for YAML config to be `.circle.yml` instead of
`circle.yml`.  I also faced troubles while trying to configure and set up
[Jenkins][jenkins] (though it was while I was working with an inexperienced
team, whom were the ones setting it up).  I've also looked at
[Shippable][shippable], but it really didn't interest me, just like the rest
&ndash; because I now enjoy working with [SemaphoreCI][semaphoreci] &ndash;
namely since the prodigy [TJ Holowaychuk][tj] recommended it to me.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Definitely the nicest CI I&#39;ve used <a href="https://t.co/ykgXUcLK1o">https://t.co/ykgXUcLK1o</a>, the others feel clunky</p>&mdash; TJ Holowaychuk (@tjholowaychuk) <a href="https://twitter.com/tjholowaychuk/status/670481124582387712">November 28, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

For anyone interested in getting into the automated CI deployment business,
it's relatively straightforward to market yourself &ndash; just list yourself
in all the Wikipedia articles, on Quora (with some upvote magic), have a good
service that doesn't shut down or lie about build times, and have clear docs.
If you do those four things, you're on the way to at least some passive income!

With regards to server hosting, I chose Digital Ocean because they rock.
I have never had a problem with them in over five years.  That's something!
I also printed t-shirts for Digital Ocean before I sold Teelaunch, and really
liked working with them.

Not only all that, but their service has great uptime, and their ~~boxes~~
"droplets" are really fast to set up and reliable.  I'm not a huge fan of
using Amazon EC2 and AWS in general for building [Rapid MVP's][mvp] (of course
I would definitely use load balancing or something for scaling an app that has
thousands of users across the world).  If your first question about building
an app is "How can I scale it?" or "Will Digital Ocean let me scale?" &ndash;
take my advice, you're doing it wrong.  Stop it.  Think [Rapid MVP][mvp].

> To put it simply, Amazon has an interface that resembles a wild jungle with
overgrown vines on every tree, and Digital Ocean's interface is a beautiful
oasis in a vast VPS desert.

> As a side note, I can almost guarantee you that sometime in the future,
everyone will want barebones boxes connected to ethernet plugs. Because imagine
when _everyone_ has fiber internet and anyone can host their e-commerce store
from a [RaspberryPI][rpi] running from their kitchen table.


## 1. Create your Droplet

First, you need a Digital Ocean account.  Be patient as their signup process
may require you to verify your email and enter your credit card.

> Sign up with this link to get $10 of free credit (2 months of hosting):
<https://m.do.co/c/a7fe489d1b27>

When you create your Digital Ocean ("DO") droplet be sure to only allow SSH
only access and add your SSH key to Digital Ocean.  You can do this from DO's
dashboard and you can find more about this on [a Digital Ocean article][doa].

> Make sure you create a droplet using the latest stable Ubuntu release.

![Digital Ocean Droplet][droplet-image]

SSH into the droplet and install dependencies for your stack with Node.
In my case, I needed to install Node, MongoDB, and Redis.  Of course, MongoDB
and Redis are optional dependencies, but I use them because they allow me to
build [Rapid MVP's][mvp] (quick prototypes in other words).  Also, I really
like to use [NVM][nvm] to manage various version of Node installed, which
was created by another prodigy, [Tim Caswell][tim-caswell].

> Make sure you replace all instances in this article of `droplet-ip-address`
with the IP address given to you by Digital Ocean for your droplet.

```bash
ssh root@droplet-ip-address
```

Install the basic requirements needed for the server:

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install vim build-essential libssl-dev git unattended-upgrades authbind openssl fail2ban
```

Install [NVM][nvm] and set it up to use the latest stable version:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
nvm install stable
nvm alias default stable
```

Install [PM2][pm2], which will handle deployments for us and manage our processes:

```
npm i -g pm2
```

Install MongoDB, which is optional:

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
service mongod status
```

Install Redis, which is optional:

```bash
sudo add-apt-repository ppa:chris-lea/redis-server
sudo apt-get update
sudo apt-get install redis-server
redis-benchmark -q -n 1000 -c 10 -P 5
source ~/.profile
```

You might also want to look into installing `fail2ban`, changing the default
SSH port, and remove password-based login access. You can find how to do this
from this section in my [security article][sa], or just Google it.


## 2. Write your Node App File

This article assumes you already have created a GitHub repository for your
project and that you already have some `app.js` file in the root of it.  If you
haven't done that yet, then this section is for you.  This section also
describes how to configure that `app.js` file for zero-downtime and graceful
reloading upon deployment of code.

For the purpose of this article, I share a basic app example that will respond
with "hello world" when you visit your droplet later on (over port `3000`).

Answer yes to all the prompts or just hit `ENTER` to breeze through it:

```bash
npm init
```

Now save the basic `express` dependency:

```bash
npm i --save express
```

Create a new file called `app.js` (or edit your existing to include `SIGINT`):

```bash
vim app.js
```

```js
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('hello world')
});

app.listen(3000);

process.on('SIGINT', function() {

  // TODO: do stuff here to clean up before reload
  // (e.g. close out DB connections, queue a job)

  setTimeout(function() {
    // 300ms later the process kills itself to allow a restart
    process.exit(0);
  }, 300);

});
```

Let's test this out locally before you bother to continue further.

```bash
node app.js
```

> Visit this URL in your browser (it should say "hello world"):
<http://localhost:3000>

> By default, PM2 will allow `1.6` seconds for your app to gracefully exit,
and you can read more on how to configure your app for zero-downtime here:
<http://pm2.keymetrics.io/docs/usage/signals-clean-restart/>


## 3. Set up SSH for SemaphoreCI

First, go to <https://semaphoreci.com> and sign up for an account.

Once you've logged in, create a project and connect with your GitHub account.

![SemaphoreCI Loading][semaphore-loading-image]

Make sure that your "Node version" shown under your SemaphoreCI project's
build settings matches the output from your droplet when you run `node -v`.

> For example, in this screenshot I have selected the `v5.8.0` that I'm using.

![SemaphoreCI Node Version][semaphore-nodeversion-image]

Now we need to add a user to the droplet to let SemaphoreCI deploy the app
after all tests have successfully passed.

> Keep your SemaphoreCI browser tab open, because we will come back to that
in just a bit!

Copy to your clipboard the contents of your local `~/.ssh/id_rsa.pub` file.
If you have not yet already created this file, see [GitHub's instructions][gi].

I'm using `pbcopy` (while on Mac OS X) to make it easy and do it the CLI way:

```bash
cat ~/.ssh/id_rsa.pub | pbcopy
```

Now SSH back into your droplet if you're not still connected:

```bash
ssh root@droplet-ip-address
```

Add the user `semaphoreci` on the droplet, so you can then SSH in as them.
When you are prompted for a password, write it down or make it memorable.

```bash
sudo adduser semaphoreci
```

Switch user to `semaphoreci` and paste your clipboard contents into the file
called `~/.ssh/authorized_keys`.  This will let you test deployments from
your local computer as the `semaphoreci` user later on.  In other words, you
can SSH into your droplet as the `semaphoreci` user easily.  It'll make sense
later, don't worry.

```bash
su semaphoreci
mkdir ~/.ssh
chmod 700 ~/.ssh
vim ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

We need to create an SSH key for the actual `semaphoreci` user, so we can then
share the contents of the private key we create on the SemaphoreCI dashboard.

Change directories to your local box's SSH folder and create a key:

```bash
cd ~/.ssh
ssh-keygen -t rsa -b 4096
```

When you're prompted to enter a file to save the key, enter the following:

`semaphoreci_id_rsa`

Don't enter a password for simplicity.

Again, copy the contents of this SSH key now to your clipboard using `pbcopy`:

```bash
cat ~/.ssh/semaphoreci_id_rsa.pub | pbcopy
```

Now SSH back into your droplet, switch to the `semaphoreci` user (see above),
and add this as a new authorized key to that same file you created earlier
(and added your own SSH key into).  You should add it as the next line in the
file on your droplet at `/home/semaphoreci/.ssh/authorized_keys`.
This will allow SemaphoreCI access to your droplet later on:

```bash
ssh root@droplet-ip-address
su semaphoreci
vim ~/.ssh/authorized_keys
```

Now go back to that browser tab you have open for SemaphoreCI, and click
on the link for "Set Up Deployment".  This link is found on the page that
looks like this:

![Semaphore Settings][semaphore-settings-image]

It will then present you with options to choose from.  Scroll down and select
the option titled "Generic Deployment", and then click "Automatic".  You should
now be on a screen that looks like this:

![Semaphore Deploy Commands][semaphore-deploycommands-image]

Add the following deploy commands where it says "Enter your deploy commands":

> Make sure you replace `droplet-ip-address` with the IP address of your
Digital Ocean droplet.  Also, if you changed to a non-standard SSH port, change
where it says `22` in `-p 22` below.

```bash
# install pm2 so we can run the deploy command
npm i -g pm2

# add this server as a known host, since we can't enter y/n when prompted
ssh-keyscan -p 22 -H droplet-ip-address >> ~/.ssh/known_hosts

# run the deployment command
pm2 deploy ecosystem.json production
```

After you enter this command, it will now prompt you to paste in the value
of the private key file for the `semaphoreci` user.  You don't have this on
your clipboard yet, so you need to use `pbcopy` again locally:

```bash
cat ~/.ssh/semaphoreci_id_rsa | pbcopy
```

Paste the contents of your clipboard in the box shown in this screenshot:

![Semaphore Private Key][semaphore-privatekey-image]

If you want to easily simulate SemaphoreCI logging in as the `semaphoreci` user
then you can do this by the running following from your local box:

```bash
ssh -i ~/.ssh/semaphoreci_id_rsa semaphoreci@droplet-ip-address
```

You can also do this command much easier by creating a file on your
local box called `~/.ssh/config` with these contents (replace your droplet IP):

```bash
Host semaphoreci-droplet
  Hostname droplet-ip-address
  User semaphoreci
  ForwardAgent yes
  Port 22
  IdentityFile ~/.ssh/semaphoreci_id_rsa
```

Then you can just run `ssh semaphoreci-droplet` and save a bit of typing.
Note that I left the line `Port 22` in there in case you change your SSH port.
The line that says `ForwardAgent yes` means it [forwards your SSH agent][fw].

I'd highly recommend you test this out right now to make sure it's set up OK.


## 4. Add new GitHub Deployment Key

Since we have a `semaphoreci` on our droplet, we now need to add a deployment
key on GitHub for our project, so that we can test deployment locally.

SemaphoreCI already has added a deployment key for your project (if you set
it up correctly), so don't be alarmed if there's already a key created when
you get to the GitHub Deployment Key settings page for your repo.  You'll be
creating another one for local testing purposes, don't worry!

First SSH into your repository as the `semaphoreci` user:

```bash
ssh semaphoreci-droplet
```

Now create an SSH key pair:

```bash
cd ~/.ssh
ssh-keygen -t rsa -b 4096
```

When it asks you where to save the file, use the default and hit `ENTER`.

Don't enter a password for simplicity, again.

Go to <https://github.com> and click on your project, then go to its Settings.

Under "Deploy keys" add a new deployment key, allow it write access, and
paste the `id_rsa.pub` public key file's content we just created.  To easily
get the contents of this public key on your clipboard, from your local box
run this command:

```bash
ssh semaphoreci-droplet "cat ~/.ssh/id_rsa.pub" | pbcopy
```

Here's the screen showing where you enter your key.  Don't be alarmed if you
already see a Deploy here in here; it's supposed to be there, as it was added
automatically by SemaphoreCI in a previous step (yes, you're adding another!):

![GitHub Deployment Key][github-deploymentkey-image]

If you get stuck on this step or need more instructions, see this article:

<https://developer.github.com/guides/managing-deploy-keys/#deploy-keys>


## 5. Share /var/www Access

We created the user `semaphoreci` in the previous section, and now we need
to give it recursive read and write access to the `/var/www` folder on the
server &ndash; so that the `pm2` command can deploy to the server (from both
our local box if we want to deploy manually, and also from SemaphoreCI's
environment for the automated continuous integration deployments).

We need to SSH into the droplet as the root user, so we can then add this
folder and then give permissions on it to the `semaphoreci` user.

```bash
ssh root@droplet-ip-address
```

Now create the folder using `sudo`:

```bash
sudo mkdir /var/www
```

> To stay in compliance with standards used widely by infrastructure teams,
we'll use the classic `www-data` group to manage permissions on this folder.

Add the `semaphoreci` user to this group:

```bash
sudo adduser semaphoreci www-data
```

Change ownership of the folder and its files recursively:

```bash
sudo chown -R www-data:www-data /var/www
```

Grant the group read and write permissions (say that phrase five times fast!):

```bash
sudo chmod -R g+wr /var/www
```

That's all.

If you wanted to test it out, then SSH in as the `semaphoreci`
user, and try to run the command `touch /var/www/test.txt`.  It should let
you create a blank text file in that folder as the `semaphoreci` user.  If you
did not do this properly, then you will encounter the following read/write
error later on:

```bash
pm2 deploy ecosystem.json production setup
--> Deploying to production environment
--> on host droplet-ip-address
mkdir: cannot create directory ‘/var/www’: Permission denied
mkdir: cannot create directory ‘/var/www’: Permission denied
mkdir: cannot create directory ‘/var/www’: Permission denied
```


## 6. Configure PM2 for Deployment

We're going to set up a configuration file to be read by PM2.

On your local box, make sure you have `pm2` installed globally:

```bash
npm i -g pm2
```

Create a new file in the root of your GitHub project called `ecosystem.json`.

```bash
vim ecosystem.json
```

Note that you can automatically create this file (with defaults) from
PM2's CLI using `pm2 ecosystem`, however for the purpose of this article
I'm providing you with the content here.  You need to replace the following:

* `droplet-ip-address` with your droplet's IP
* `repo` property value with the path to your GitHub repo

```json
{
  "apps": [
    {
      "name": "App",
      "script": "app.js",
      "exec_mode": "cluster",
      "instances": "max",
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ],
  "deploy": {
    "production": {
      "user": "semaphoreci",
      "host": "droplet-ip-address",
      "ref": "origin/master",
      "repo": "git@github.com:username/reponame.git",
      "path": "/var/www/production",
      "post-deploy": "npm i && pm2 startOrGracefulReload ecosystem.json --env production",
      "forward-agent": "yes"
    }
  }
}
```

> If you need a reference for the options here, see the official docs here:
<http://pm2.keymetrics.io/docs/usage/deployment/>

> Note, if you have a custom port, you'll need to add that as a `"port"`
property in your `ecosystem.json`'s `deploy` nested object for each env.

Now run setup for deployment with PM2 using the CLI command, and make sure
you run this command from the root of your project's folder locally:

```bash
pm2 deploy ecosystem.json production setup
```

> You could (for fun) try running this command twice.  If it worked the first
time, you will get an error on the second try; it will say the folder exists
already at the path `/var/www/production`!

Go ahead and deploy the production environment and start its processes:

```bash
pm2 deploy ecosystem.json production
```

> You can test it out at the following link (replace with your IP):
<http://your-droplet-ip:3000>

If all is OK, then make sure that PM2 is scheduled to
[startup automatically][startup] if your server reboots or something happens.

Make sure you run this command as the `semaphoreci` user on the droplet:

```bash
ssh semaphoreci-droplet
pm2 startup ubuntu
```

It will give you output which you will then need to run as a user with root
access, which you can get by running:

```bash
ssh root@droplet-ip-address
sudo su -c "env PATH=$PATH:/usr/local/bin pm2 startup ubuntu -u semaphoreci --hp /home/semaphoreci"
```

Now save the current processes to automatically restore them if your
server reboots or something happens.  To do this, first make sure we have PM2
processes running that we'll be able to save:

```bash
ssh semaphoreci-droplet
pm2 status
```

> If no processes appear, go back to the section with PM2 deployment commands,

If your processes appear, then run this command as the `semaphoreci` user
on the droplet, so that these processes will get restored if something happens:

```bash
ssh semaphoreci-droplet
pm2 save
```

All done!  Now try to commit some code and watch SemaphoreCI deploy it for you.

For example, you could make it say "thanks nifty" instead of "hello world":

```bash
vim app.js
```

```diff
app.get('/', function(req, res) {
-  res.send('hello world')
+  res.send('thanks nifty')
});
```

```bash
git add .
git commit -m 'testing out semaphoreci automatically deploy my project'
git push origin master
```

> Now just wait and watch the SemaphoreCI dashboard.  It will run a build,
then it will deploy it to your Digital Ocean droplet for you using PM2.

If you want to see the `pm2 save` do its magic, then just run `sudo reboot`,
or reboot your droplet from Digital Ocean's interface.  When it powers back on,
SSH into it as `semaphoreci`, and run `pm2 status` to see your app is running.


## 7. PM2 Deployment Commands

This documentation is sourced directly from [Keymetrics Blog][km-blog] and
also from the [official PM2 deploy documentation][official-docs].

```bash
# update the code for production
pm2 deploy production update

# revert to [n] th commit for production
pm2 deploy production revert 1

# execute a command on the production server
pm2 deploy production exec "pm2 restart all"
```

This `deploy` command option is inspired from TJ's `deploy` shell script at:

<https://github.com/visionmedia/deploy>


## Notes

* If you found this article useful, or if you want to ask a question, or need
my help with something, please reach out by emailing <niftylettuce@gmail.com>
or on Twitter [@niftylettuce][twitter-link].
* Make sure you add a SemaphoreCI badge to your Readme, and write (some) tests!
* If you want to run your app on port `80` or `443` (restricted ports), then
you can easily do this using `authbind`.  Read [PM2's docs][authbind] on this.
You may also need to modify your `ecosystem.json` file to use authbind too.
For example, my `post-deploy` line, looks something like this:
  ```js
  {
    "post-deploy": "npm i && npm test && authbind --deep pm2 startOrGracefulReload ecosystem.json --env production"
  }
  ```
* If you want to run a redirection from `http` to `https` on your server, then
you could use [node-http-proxy][node-http-proxy], or `nginx`'s reverse proxy.
* I created this doc using [vim-instant-markdown][vim-instant-markdown], and I
would have used my own project [Seuss.md][seuss], but it wasn't ready yet when
I started to write.
* There might be typos or instructions I'm missing, if so send a pull request.


[vim-instant-markdown]: https://github.com/suan/vim-instant-markdown
[seuss]: https://github.com/niftylettuce/seuss.md
[nvm]: https://github.com/creationix/nvm
[tim-caswell]: https://github.com/creationix
[travis]: https://travis-ci.com/
[circle]: https://circleci.com/
[cci-removal]: https://twitter.com/niftylettuce/status/672544974899023872
[gi]: https://help.github.com/articles/generating-an-ssh-key/
[sa]: https://github.com/niftylettuce/amazon-ec2-node-stack#ubuntu-security-configuration
[doa]: https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-digitalocean-droplets
[email-updates]: https://niftylettuce.us7.list-manage.com/subscribe?u=91152ecc569b5850cf9d4bdb1&id=87242e9b89
[jenkins]: https://jenkins.io/
[shippable]: https://app.shippable.com/
[semaphoreci]: https://semaphoreci.com
[tj]: https://github.com/tj
[l]: https://github.com/torvalds
[amazon-boost]: http://observer.com/2016/02/behind-the-scam-what-does-it-takes-to-be-a-bestselling-author-3-and-5-minutes/
[pm2]: https://github.com/Unitech/pm2
[nodejs]: https://nodejs.org/en/
[digital-ocean]: https://www.digitalocean.com/
[fw]: https://developer.github.com/guides/using-ssh-agent-forwarding/
[github]: https://github.com/
[rpi]: http://amzn.to/1WqX3pZ
[startup]: http://pm2.keymetrics.io/docs/usage/startup/
[km-blog]: https://keymetrics.io/2014/06/25/ecosystem-json-deploy-and-iterate-faster/
[official-docs]: http://pm2.keymetrics.io/docs/usage/deployment/
[droplet-image]: https://i.imgur.com/2yroKWo.png
[semaphore-loading-image]: https://i.imgur.com/cbU1so0.png
[semaphore-nodeversion-image]: https://i.imgur.com/KebeWJL.png
[semaphore-settings-image]: https://i.imgur.com/Ho9wJVh.png
[semaphore-deploycommands-image]: https://i.imgur.com/VJjuAGr.png
[semaphore-privatekey-image]: https://i.imgur.com/syZORDH.png
[github-deploymentkey-image]: https://i.imgur.com/FwelaCI.png
[authbind]: http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#allow-pm2-to-bind-applications-on-ports-80-443-without-root
[node-http-proxy]: https://github.com/nodejitsu/node-http-proxy
[twitter-link]: https://twitter.com/niftylettuce
[mvp]: https://github.com/niftylettuce/rapid-mvp-standards
[ci-pm2-setup-image]: https://i.imgur.com/dfvLUpa.png
