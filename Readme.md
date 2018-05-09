<a name="module_@token.store/ethjs-order-signer"></a>

## @token.store/ethjs-order-signer

* [@token.store/ethjs-order-signer](#module_@token.store/ethjs-order-signer)
    * [~createSignature(order, privateKeyBuffer)](#module_@token.store/ethjs-order-signer..createSignature) ⇒ <code>Signature</code>
    * [~getAddressFromSignedOrder(order)](#module_@token.store/ethjs-order-signer..getAddressFromSignedOrder) ⇒ <code>string</code>
    * [~Signature](#module_@token.store/ethjs-order-signer..Signature) : <code>Object</code>

<a name="module_@token.store/ethjs-order-signer..createSignature"></a>

### @token.store/ethjs-order-signer~createSignature(order, privateKeyBuffer) ⇒ <code>Signature</code>
**Kind**: inner method of [<code>@token.store/ethjs-order-signer</code>](#module_@token.store/ethjs-order-signer)

| Param | Type |
| --- | --- |
| order | <code>Object</code> |
| order.contract | <code>string</code> |
| order.tokenGet | <code>string</code> |
| order.amountGet | <code>string</code> |
| order.tokenGive | <code>string</code> |
| order.amountGive | <code>string</code> |
| order.expires | <code>number</code> |
| order.nonce | <code>number</code> |
| privateKeyBuffer | <code>Buffer</code> |

<a name="module_@token.store/ethjs-order-signer..getAddressFromSignedOrder"></a>

### @token.store/ethjs-order-signer~getAddressFromSignedOrder(order) ⇒ <code>string</code>
**Kind**: inner method of [<code>@token.store/ethjs-order-signer</code>](#module_@token.store/ethjs-order-signer)

| Param | Type |
| --- | --- |
| order | <code>Object</code> |
| order.contract | <code>string</code> |
| order.tokenGet | <code>string</code> |
| order.amountGet | <code>string</code> |
| order.tokenGive | <code>string</code> |
| order.amountGive | <code>string</code> |
| order.expires | <code>number</code> |
| order.nonce | <code>number</code> |
| order.signature | <code>Signature</code> |

<a name="module_@token.store/ethjs-order-signer..Signature"></a>

### @token.store/ethjs-order-signer~Signature : <code>Object</code>
**Kind**: inner typedef of [<code>@token.store/ethjs-order-signer</code>](#module_@token.store/ethjs-order-signer)
**Properties**

| Name | Type |
| --- | --- |
| v | <code>number</code> |
| r | <code>string</code> |
| s | <code>string</code> |

