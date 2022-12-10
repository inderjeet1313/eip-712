//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract demo is EIP712 {


    using ECDSA for bytes32;
    address minter;

    bytes32 private constant TYPEHASH =
        keccak256(
            "ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce)"
        );
    
    constructor() EIP712("ForwardRequest", "1") {
        minter = msg.sender;
    }

    function getAddress(bytes memory signature) public view returns (address signer, bool response) {
        signer = _hashTypedDataV4(keccak256(_encodeRequest())).recover(signature);
        if(signer == minter) {
            response = true;
        }
        else {
            response = false;
        }
    }

    function _encodeRequest() private pure returns (bytes memory) {
        return
            abi.encode(
                TYPEHASH,
                0x7d917A10CfE07ab0EFB4d12C5EcE4bF4c26a1C6d,
                0xC508Ec1381C617AE9aEb6385738c728e2eBC4E22,
                100,
                21000,
                10
            );
    }

}