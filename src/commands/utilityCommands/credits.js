const { GenericCommand } = require('../../models/')

const developers = [
  'Melmsie#0001',
  'Aetheryx#2222',
  'CyberRonin#5517',
  'Kromatic#0420'
]
const contributors = [
  'DaJuukes#0001'
]
const staff = [
  'Ken#0027',
  'DevinThePancake#5559',
  'xXBuilderBXx#8265',
  'SquiDaddy#0001',
  'Lizard#0001',
  'Sporks#7339',
  'trAsh#6859'
]

module.exports = new GenericCommand(
  () => ({
    title: 'Dank Memer Credits',
    fields: [
      { name: 'Developers', value: developers.join('\n') },
      { name: 'Contributors', value: contributors.join('\n') },
      { name: 'Support Server Staff', value: staff.join('\n') }
    ]
  }), {
    triggers: ['credits', 'helpers'],
    description: 'Thanks to all of you!',
    perms: ['embedLinks']
  }
)
