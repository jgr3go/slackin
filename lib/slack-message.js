import request from 'superagent'

export default function message({ org, token, email, username, channel }, fn) {
  let data = { token, channel }
  data.text = `<!channel> ${username} has requested to join this slack (${email})!`;

  console.log('sending', data);

  request
    .post(`https://${org}.slack.com/api/chat.postMessage`)
    .type('form')
    .send(data)
    .end(function (err, res) {
      if (err) return fn(err);
      if (200 != res.status) {
        fn(new Error(`Invalid response ${res.status}.`))
        return
      }

      let { ok, error: providedError, needed } = res.body
      if (!ok) {
        fn(new Error(providedError))
        return
      }

      fn(null)
    })
}