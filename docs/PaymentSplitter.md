# Solidity API

# PaymentSplitter

## totalReleased

```solidity
function totalReleased() public view returns (uint256)
```

_Getter for the total amount of Ether already released._

## totalReleased

```solidity
function totalReleased(contract IERC20 token) public view returns (uint256)
```

_Getter for the total amount of &#x60;token&#x60; already released. &#x60;token&#x60; should be the address of an IERC20
contract._

## shares

```solidity
function shares(address account) public view returns (uint256)
```

_Getter for the amount of shares held by an account._

## released

```solidity
function released(address account) public view returns (uint256)
```

_Getter for the amount of Ether already released to a payee._

## released

```solidity
function released(contract IERC20 token, address account) public view returns (uint256)
```

_Getter for the amount of &#x60;token&#x60; tokens already released to a payee. &#x60;token&#x60; should be the address of an
IERC20 contract._

## totalDepositedAmount

```solidity
function totalDepositedAmount() public view returns (uint256)
```

_Getter for the amount of Ether deposited via the deposit() function._

## totalDepositedReleased

```solidity
function totalDepositedReleased() public view returns (uint256)
```

_Getter for the amount of Ether already release via the withdraw() function._

## payee

```solidity
function payee(uint256 index) public view returns (address)
```

_Getter for the address of the payee number &#x60;index&#x60;._

## release

```solidity
function release(address payable account) public virtual
```

_Triggers a transfer to &#x60;account&#x60; of the amount of Ether they are owed, according to their percentage of the
total shares and their previous withdrawals._

## release

```solidity
function release(contract IERC20 token, address account) public virtual
```

_Triggers a transfer to &#x60;account&#x60; of the amount of &#x60;token&#x60; tokens they are owed, according to their
percentage of the total shares and their previous withdrawals. &#x60;token&#x60; must be the address of an IERC20
contract._

## allocateShares

```solidity
function allocateShares(address[] accounts, uint256[] shares_) external
```

_Allocate a portion of your shares to a new or existing payee._

| Name     | Type      | Description                              |
| -------- | --------- | ---------------------------------------- |
| accounts | address[] | The address of the payee to add.         |
| shares\_ | uint256[] | The number of shares owned by the payee. |
