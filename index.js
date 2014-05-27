var http = require('http')

module.exports = function(bot) {
  bot.on('msg', function(msg){
    var regex = /^!r (\w*) ?(\w*)?$/
    var matches = msg.msg.match(regex)

    if(!matches) {
      return
    }

    var postIndex = matches[2] || 0;

    var payload = ''
    req = http.get('http://www.reddit.com/r/' + encodeURI(matches[1].trim()) + '.json', function(res) {
      if (res.statusCode !== 200) {
        return
      }
      res.on('data', function(chunk){
        payload += chunk.toString()
      })
      res.on('end', function(){
        var posts = JSON.parse(payload)

        if(postIndex > posts.data.children.length) {
          return
        }

        var post = posts.data.children[postIndex].data
        var response = msg.sender + ': ' + post.title + ' - ' + post.url
        bot.msg([msg.chan], response)
      })
    })
  })
}
