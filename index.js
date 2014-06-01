var http = require('http')
var terminus = require('terminus')

module.exports = function(bot) {
  bot.on('msg', function(msg){
    var regex = /^!r (\w*) ?(\w*)?$/
    var matches = msg.msg.match(regex)
    if (!matches)  return
    var postIndex = matches[2] || 0;
    var base = 'http://www.reddit.com/r/';

    req = http.get(base + encodeURI(matches[1].trim()) + '.json', function(res) {
      if (res.statusCode !== 200)  return
      res.pipe(terminus.concat(function(body) {
        var posts = JSON.parse(body.toString())

        if(postIndex > posts.data.children.length) {
          return
        }

        var post = posts.data.children[postIndex].data
        var response = msg.sender + ': ' + post.title + ' - ' + post.url
        bot.msg([msg.chan], response)
      }))

    })

  })
}
