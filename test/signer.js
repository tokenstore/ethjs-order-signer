/* eslint-env node, mocha */

const assert = require('assert')

const signer = require('../src/signer')

const address = '0xff893178eeb98c5e1740973d5c100374f1b82910'
const privateKey = 'd38127980869e585639efc7b8d9a30643b486ba62d265fbf8809de9f4fc42c6b'

const orderExamples = [
  {
    account: '0xff893178eeb98c5e1740973d5c100374f1b82910',
    contract: '0x1cE7AE555139c5EF5A57CC8d814a867ee6Ee33D8',
    tokenGet: '0xd780ae2bf04cd96e577d3d014762f831d97129d0',
    amountGet: '1000000000000000000000',
    tokenGive: '0x0000000000000000000000000000000000000000',
    amountGive: '500000000000000000',
    nonce: 8486112808524591,
    expires: 5586594,
    signature: {
      v: 28,
      r: '0x8a6c325b912f03571095d34696d4fbd743ae6124495458496341cf6f364deac4',
      s: '0x3e3338ae9e22ac284b7364885228cfe85faa871e4210e1433ee0282a2fea2799'
    }
  },
  {
    'account': '0xff893178eeb98c5e1740973d5c100374f1b82910',
    'contract': '0x1cE7AE555139c5EF5A57CC8d814a867ee6Ee33D8',
    'tokenGet': '0xd780ae2bf04cd96e577d3d014762f831d97129d0',
    'amountGet': 1e+28,
    'tokenGive': '0x0000000000000000000000000000000000000000',
    'amountGive': 10000000000000000,
    'nonce': 774937180,
    'expires': 5613975,
    'signature': {
      'r': '0x2f6c63dc5beb51621162b294ef8cec68cf155b849cc4fd6d79491ed71e912229',
      's': '0x444d970a7a2c1f0c591903e20d08c1b5b71187aef9e843068535232f292845ae',
      'v': 28
    }
  }
]

describe('Signer', function () {
  orderExamples.forEach((orderExample, index) => {
    it(`should sign order #${index}`, function () {
      const signature = signer.createSignature(orderExample, Buffer.from(privateKey, 'hex'))
      assert.deepEqual(signature, orderExample.signature)
    })

    it(`should get address from signed order #${index}`, function () {
      const addressFromOrder = signer.getAddressFromSignedOrder(orderExample)
      assert.equal(addressFromOrder, address)
    })
  })
})
