const { GenericCommand } = require('../../models/')

const developers = [
  'Melmsie#0001',
  'Aetheryx#2222',
  'CyberRonin#5517',
  'Kromatic#0420',
  'Ken#0027'
]
const mDonors = [
  'ADMRLParangosky#0001',
  'Arbër#5549',
  'Donovan_DMC#1337',
  'NinjaChicken#9999',
  'The Plague#0001',
  'The Psycho One#0001'
]
const staff = [
  'xXBuilderBXx#8265',
  'DevinThePancake#5559',
  'Juan Pablo#2655',
  'Lizard#0001',
  'LoverofSporks#9967',
  'SquiDaddy#6969',
  'Talon#6382',
  'trAsh#6859'
]

module.exports = new GenericCommand(
  () => ({
    title: 'Dank Memer Credits',
    fields: [
      { name: 'Developers', value: developers.join('\n') },
      { name: 'Mega Donors', value: mDonors.join('\n') },
      { name: 'Support Server Staff', value: staff.join('\n') }
    ]
  }), {
    triggers: ['credits', 'helpers'],
    description: 'Thanks to all of you!',
    perms: ['embedLinks']
  }
)
