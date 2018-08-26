module.exports = {
  help: 'change bot status',
  fn: async ({ Memer, args }) => {
    Memer.http.post(`${Memer.config.links.website}/api/cmds`)
      .set('Authorization', Memer.secrets.microservices.endpoints)
      .send({ 'commands': Memer.cmds })
      .end()
    return `Commands were pushed to \`/api/cmds\``
  }
}
