const { GenericCommand } = require('../../models/')

const developers = [
  'Melmsie#0001',
  'Aetheryx#2222',
  'CyberRonin#5517',
  'Kromatic#0420'
]
const mDonors = [
  'ADMRLParangosky#0001',
  'Arbër#5549',
  'Donovan_DMC#1337',
  'Eric Wong#0001',
  'Flater#0420',
  'Hestia#0023',
  'InfectedGerm#0738',
  'The Plague#0001',
  'RyanHWilson#0002',
  'Shaz#1337',
  'Sheepii#4358',
  'Shooshi#6509',
  'Skecko 💖#1801',
  'SquiDaddy#6969',
  'The Psycho One#0001',
  'jack#33301'
]
const staff = [
  'Aly#0022',
  'LeMythe#7739',
  'Erman The German#6598',
  'xXBuilderBXx#8265',
  'shadowscar00#0001',
  'SquiDaddy#6969',
  'Someguy...#3552',
  'TheExiledBanana#4865'
]

module.exports = new GenericCommand(
  () => ({
    title: 'Dank Memer Credits',
    fields: [
      { name: 'Developers', value: developers.join('\n') },
      { name: 'Mega Donors', value: mDonors.join('\n') },
      { name: 'Server Mods', value: staff.join('\n') }
    ]
  }), {
    triggers: ['credits', 'helpers'],
    description: 'Thanks to all of you!',
    perms: ['embedLinks']
  }
)
