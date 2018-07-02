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
  'AssumedQui#6764',
  'xXBuilderBXx#8265',
  'Chase#7739',
  'Hestia#0023',
  'Hᵃᶜʰⁱᵏᵒ🐶#3838',
  'I SHOT MY LEG#9008',
  'William#2018',
  'perryprog#9657',
  'SquiDaddy#4277',
  'StuffBeGood#5410',
  'Juan Pablo#2655',
  'ZoupFox#8667'
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
