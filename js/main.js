
// # main

;(function() {

  $(function() {

    var $body = $('body')

    // Replace all header tags with anchor tags
    $body.find('h1, h2, h3, h4, h5, h6').each(function(i, el) {
      // Remove <sup> from text
      var $sup = $(this).find('sup')
      if ($sup.length !== 0)
        $(this).find('sup').remove()
      var text = $(this).text().trim()
      // Prepare the link
      var link = text.replace(/\s/g, '-').toLowerCase()
      // Replace all characters that are not A-Z, 0-9, -, _, \s
      link = link.replace(/[^A-Za-z0-9_-\s]+/g, '')
      $(this).html('<a href="#' + link + '" name="' + link + '" id="' + link + '">' + text + '</a>' + (($sup.length !== 0) ? ' ' + $.html($sup) : '' ) )
    })

    // Add prettyprint and linenums all <pre>'s
    $body.find('pre').addClass('prettyprint')

    // Add .table, .table-striped, .table-hover to all <table>'s
    $body.find('table').addClass('table table-striped table-hover')

    // make code pretty
    /*globals prettyPrint*/
    if (window.prettyPrint)
      prettyPrint()

  })

}).call(this)

