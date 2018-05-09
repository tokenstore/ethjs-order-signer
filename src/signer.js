/**
 * @module @token.store/ethjs-order-signer
 */
const {
  BN,
  ecsign,
  ecrecover,
  pubToAddress,
  sha256,
  hashPersonalMessage
} = require('ethereumjs-util')

function zeroPad (num, places) {
  const zero = (places - num.toString().length) + 1
  return Array(+(zero > 0 && zero)).join('0') + num
}

function parseToDigitsArray (str, base) {
  const digits = str.split('')
  const ary = []
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    const n = parseInt(digits[i], base)
    if (isNaN(n)) return null
    ary.push(n)
  }
  return ary
}

function add (x, y, base) {
  const z = []
  const n = Math.max(x.length, y.length)
  let carry = 0
  let i = 0
  while (i < n || carry) {
    const xi = i < x.length ? x[i] : 0
    const yi = i < y.length ? y[i] : 0
    const zi = carry + xi + yi
    z.push(zi % base)
    carry = Math.floor(zi / base)
    i += 1
  }
  return z
}

function multiplyByNumber (numIn, x, base) {
  let num = numIn
  if (num < 0) return null
  if (num === 0) return []
  let result = []
  let power = x
  while (true) { // eslint-disable-line no-constant-condition
    if (num & 1) { // eslint-disable-line no-bitwise
      result = add(result, power, base)
    }
    num = num >> 1 // eslint-disable-line operator-assignment, no-bitwise
    if (num === 0) break
    power = add(power, power, base)
  }
  return result
}

function convertBase (str, fromBase, toBase) {
  const digits = parseToDigitsArray(str, fromBase)
  if (digits === null) return null
  let outArray = []
  let power = [1]
  for (let i = 0; i < digits.length; i += 1) {
    if (digits[i]) {
      outArray = add(outArray,
        multiplyByNumber(digits[i], power, toBase), toBase)
    }
    power = multiplyByNumber(fromBase, power, toBase)
  }
  let out = ''
  for (let i = outArray.length - 1; i >= 0; i -= 1) {
    out += outArray[i].toString(toBase)
  }
  if (out === '') out = 0
  return out
}

function decToHex (dec, lengthIn) {
  let length = lengthIn
  if (!length) length = 32
  if (dec < 0) {
    // return convertBase((Math.pow(2, length) + decStr).toString(), 10, 16);
    return (new BN(2)).pow(length).add(new BN(dec)).toString(16)
  }
  let result = null
  try {
    result = convertBase(dec.toString(), 10, 16)
  } catch (err) {
    result = null
  }
  if (result) {
    return result
  }
  return (new BN(dec)).toString(16)
}

function pack (dataIn, lengths) {
  let packed = ''
  const data = dataIn.map(x => x)
  for (let i = 0; i < lengths.length; i += 1) {
    if (typeof (data[i]) === 'string' && data[i].substring(0, 2) === '0x') {
      if (data[i].substring(0, 2) === '0x') data[i] = data[i].substring(2)
      packed += zeroPad(data[i], lengths[i] / 4)
    } else if (typeof (data[i]) !== 'number' && !(data[i] instanceof BN) && /[a-f]/.test(data[i])) {
      if (data[i].substring(0, 2) === '0x') data[i] = data[i].substring(2)
      packed += zeroPad(data[i], lengths[i] / 4)
    } else {
      // packed += zeroPad(new BigNumber(data[i]).toString(16), lengths[i]/4);
      packed += zeroPad(decToHex(data[i], lengths[i]), lengths[i] / 4)
    }
  }
  return packed
}

/**
 * @typedef {Object} Signature
 * @property {number} v
 * @property {string} r
 * @property {string} s
 */

/**
 * @param {Object} order
 * @param {string} order.contract
 * @param {string} order.tokenGet
 * @param {string} order.amountGet
 * @param {string} order.tokenGive
 * @param {string} order.amountGive
 * @param {number} order.expires
 * @param {number} order.nonce
 * @param {Buffer} privateKeyBuffer
 * @returns {Signature}
 */
function createSignature (order, privateKeyBuffer) {
  const condensed = pack([
    order.contract,
    order.tokenGet,
    order.amountGet,
    order.tokenGive,
    order.amountGive,
    order.expires,
    order.nonce
  ], [160, 160, 256, 160, 256, 256, 256])
  const hash = sha256(Buffer.from(condensed, 'hex'))
  const msgB = hashPersonalMessage(hash)

  const sig = ecsign(msgB, privateKeyBuffer)

  const v = sig.v
  const r = `0x${sig.r.toString('hex')}`
  const s = `0x${sig.s.toString('hex')}`

  return {v, r, s}
}

/**
 * @param {Object} order
 * @param {string} order.contract
 * @param {string} order.tokenGet
 * @param {string} order.amountGet
 * @param {string} order.tokenGive
 * @param {string} order.amountGive
 * @param {number} order.expires
 * @param {number} order.nonce
 * @param {Signature} order.signature
 * @returns {string}
 */
function getAddressFromSignedOrder (order) {
  const condensed = pack([
    order.contract,
    order.tokenGet,
    order.amountGet,
    order.tokenGive,
    order.amountGive,
    order.expires,
    order.nonce
  ], [160, 160, 256, 160, 256, 256, 256])
  const hash = sha256(Buffer.from(condensed, 'hex'))
  const msgB = hashPersonalMessage(hash)

  const publicKey = ecrecover(
    msgB,
    order.signature.v,
    Buffer.from(order.signature.r.slice(2), 'hex'),
    Buffer.from(order.signature.s.slice(2), 'hex')
  )

  return `0x${pubToAddress(publicKey).toString('hex')}`
}

module.exports = {
  createSignature,
  getAddressFromSignedOrder
}
