// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ERC20 {
    function initialize(string memory name_, string memory symbol_) external;

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool);

    function _transfer(address from, address to, uint256 amount) external;
    function _mint(address account, uint256 amount) external;
    function _burn(address account, uint256 amount) external;
    function _approve(address owner, address spender, uint256 amount) external;
    function _spendAllowance(address owner, address spender, uint256 amount) external;

    function _beforeTokenTransfer(address from, address to, uint256 amount) external;
    function _afterTokenTransfer(address from, address to, uint256 amount) external;
}
