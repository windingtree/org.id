* [LifTestInitializable](#liftestinitializable)
  * [Approval](#event-approval)
  * [MinterAdded](#event-minteradded)
  * [MinterRemoved](#event-minterremoved)
  * [Transfer](#event-transfer)
  * [addMinter](#function-addminter)
  * [allowance](#function-allowance)
  * [approve](#function-approve)
  * [balanceOf](#function-balanceof)
  * [decimals](#function-decimals)
  * [decreaseAllowance](#function-decreaseallowance)
  * [increaseAllowance](#function-increaseallowance)
  * [initialize](#function-initialize)
  * [isMinter](#function-isminter)
  * [mint](#function-mint)
  * [name](#function-name)
  * [renounceMinter](#function-renounceminter)
  * [symbol](#function-symbol)
  * [totalSupply](#function-totalsupply)
  * [transfer](#function-transfer)
  * [transferFrom](#function-transferfrom)

# LifTestInitializable

## *event* Approval

LifTestInitializable.Approval(owner, spender, value) `8c5be1e5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | owner | indexed |
| *address* | spender | indexed |
| *uint256* | value | not indexed |

## *event* MinterAdded

LifTestInitializable.MinterAdded(account) `6ae17283`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | account | indexed |

## *event* MinterRemoved

LifTestInitializable.MinterRemoved(account) `e94479a9`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | account | indexed |

## *event* Transfer

LifTestInitializable.Transfer(from, to, value) `ddf252ad`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | indexed |
| *address* | to | indexed |
| *uint256* | value | not indexed |


## *function* addMinter

LifTestInitializable.addMinter(account) `nonpayable` `983b2d56`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | account | undefined |


## *function* allowance

LifTestInitializable.allowance(owner, spender) `view` `dd62ed3e`

> See {IERC20-allowance}.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | owner | undefined |
| *address* | spender | undefined |


## *function* approve

LifTestInitializable.approve(spender, amount) `nonpayable` `095ea7b3`

> See {IERC20-approve}.     * Requirements:     * - `spender` cannot be the zero address.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | spender | undefined |
| *uint256* | amount | undefined |


## *function* balanceOf

LifTestInitializable.balanceOf(account) `view` `70a08231`

> See {IERC20-balanceOf}.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | account | undefined |


## *function* decimals

LifTestInitializable.decimals() `view` `313ce567`





## *function* decreaseAllowance

LifTestInitializable.decreaseAllowance(spender, subtractedValue) `nonpayable` `a457c2d7`

> Atomically decreases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | spender | undefined |
| *uint256* | subtractedValue | undefined |


## *function* increaseAllowance

LifTestInitializable.increaseAllowance(spender, addedValue) `nonpayable` `39509351`

> Atomically increases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | spender | undefined |
| *uint256* | addedValue | undefined |


## *function* initialize

LifTestInitializable.initialize(__owner, _name, _symbol, _decimals, _supply) `nonpayable` `1ca29139`

> Initializer for upgradeable contracts

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the tokens minter |
| *string* | _name | Token name |
| *string* | _symbol | Token symbol |
| *uint256* | _decimals | Token decimals |
| *uint256* | _supply | Total supply |


## *function* isMinter

LifTestInitializable.isMinter(account) `view` `aa271e1a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | account | undefined |


## *function* mint

LifTestInitializable.mint(account, amount) `nonpayable` `40c10f19`

> See {ERC20-_mint}.     * Requirements:     * - the caller must have the {MinterRole}.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | account | undefined |
| *uint256* | amount | undefined |


## *function* name

LifTestInitializable.name() `view` `06fdde03`





## *function* renounceMinter

LifTestInitializable.renounceMinter() `nonpayable` `98650275`





## *function* symbol

LifTestInitializable.symbol() `view` `95d89b41`





## *function* totalSupply

LifTestInitializable.totalSupply() `view` `18160ddd`

> See {IERC20-totalSupply}.




## *function* transfer

LifTestInitializable.transfer(recipient, amount) `nonpayable` `a9059cbb`

> See {IERC20-transfer}.     * Requirements:     * - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | recipient | undefined |
| *uint256* | amount | undefined |


## *function* transferFrom

LifTestInitializable.transferFrom(sender, recipient, amount) `nonpayable` `23b872dd`

> See {IERC20-transferFrom}.     * Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20};     * Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`'s tokens of at least `amount`.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | sender | undefined |
| *address* | recipient | undefined |
| *uint256* | amount | undefined |


---