---
date: 2013-06-25
title: 60 Second User Retention with Node.js and MongoDB
description: Quickly send out an email to your users with Node.js and MongoDB.
template: post.jade
---

This is a quick example of exporting a collection with MongoDB and then sending user emails with Node.js.

1. Export a JSON collection of all users:

    > You can filter out specific fields with the `-f` option if needed (which is useful for variable-based email).

    > Be sure to values for `--port`, `--host`, `--db`, `-c` (collection), `-u`, and `-p`.

    ```bash
    mongoexport --port 1337 --host something.mongohq.com --db your-db-name -c users -u 'YOUR-USERNAME' -p 'YOUR-PASSWORD' -f email --jsonArray > users.json
    ```

2. Parse the JSON:

    > The following JS snippet requires you install the NPM module for [Postmark](http://postmarkapp.com), but you can use an alternative such as [email-templates](http://niftylettuce.com/node-email-templates/).

    ```bash
    npm install postmark
    ```

    ```bash
    vim parse.js
    ```

    ```js
    var postmark = require('postmark')('YOUR-API-KEY')
    var fs = require('fs')
    var path = require('path')
    var file = path.join(__dirname, 'users.json')

    ///*
    var records = fs.readFileSync(file)
    records = JSON.parse(records)
    //*/

    // you can comment the above and uncomment below to send a test email
    //var records = [{ email: 'niftylettuce@gmail.com' }]

    var text = "We noticed you signed up, but haven't yet integrated with our API at https://getprove.com/docs."
    text += "\n\n"
    text += "Did you need help or run into API issues?"
    text += "\n\n"
    text += "P.S. We'll give you 100 free additional credits if you get in touch."

    for(var i=0; i<records.length; i++) {
      var record = records[i]
      postmark.send({
        From: 'support@getprove.com',
        To: record.email,
        Tag: 'user-retention',
        Subject: 'Prove - Integrate today and earn 100 free additional credits',
        TextBody: text
      }, callback)
    }

    function callback(err, success) {
      console.log('err', err, 'success', success)
    }
    ```

3. Send the emails:

    ```bash
    node parse
    ```

This snippet was used with a small project of mine called Prove.

Proves lets developers integrate phone verification and two-factor auth in minutes.

<https://getprove.com>
