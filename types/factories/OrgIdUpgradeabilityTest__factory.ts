/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  OrgIdUpgradeabilityTest,
  OrgIdUpgradeabilityTestInterface,
} from "../OrgIdUpgradeabilityTest";

const _abi = [
  {
    inputs: [],
    name: "CalledNotByOrgIdOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionDomain",
        type: "bytes32",
      },
    ],
    name: "ContractAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDelegatesInput",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "OrgIdAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "OrgIdNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "OrgJsonUriEmpty",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "TokenNotFound",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OrgIdCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "delegates",
        type: "string[]",
      },
    ],
    name: "OrgIdDelegatesAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "delegates",
        type: "string[]",
      },
    ],
    name: "OrgIdDelegatesRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "orgJsonUri",
        type: "string",
      },
    ],
    name: "OrgJsonUriChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "__OrgIdV2_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        internalType: "string[]",
        name: "dids",
        type: "string[]",
      },
    ],
    name: "addDelegates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "orgJsonUri",
        type: "string",
      },
    ],
    name: "createOrgId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "getDelegates",
    outputs: [
      {
        internalType: "string[]",
        name: "dids",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getOrgId",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "orgJsonUri",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cursor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "getOrgIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "orgIds",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOrgIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "orgIds",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "getTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "removeDelegates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        internalType: "string[]",
        name: "dids",
        type: "string[]",
      },
    ],
    name: "removeDelegates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "orgJsonUri",
        type: "string",
      },
    ],
    name: "setOrgJson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612ede806100206000396000f3fe608060405234801561001057600080fd5b50600436106101cf5760003560e01c80636352211e11610104578063a22cb465116100a2578063c9cb65e111610071578063c9cb65e1146103e1578063dfe0f51114610401578063e4f6499014610414578063e985e9c51461041c57600080fd5b8063a22cb46514610395578063b88d4fde146103a8578063bc52570b146103bb578063c87b56dd146103ce57600080fd5b806374427b1e116100de57806374427b1e1461035a5780638129fc1c1461036257806395d89b411461036a57806398980a8a1461037257600080fd5b80636352211e1461031457806363ceab541461032757806370a082311461034757600080fd5b806323b872dd1161017157806342842e0e1161014b57806342842e0e146102d35780634f6ccce7146102e657806354fd4d50146102f95780635d96b7391461030157600080fd5b806323b872dd1461029a5780632f745c59146102ad57806335178d91146102c057600080fd5b8063081812fc116101ad578063081812fc14610235578063095ea7b3146102605780630ad0abce1461027557806318160ddd1461028857600080fd5b80630193eda6146101d457806301ffc9a7146101fd57806306fdde0314610220575b600080fd5b6101e76101e2366004612ac7565b610458565b6040516101f49190612b6e565b60405180910390f35b61021061020b366004612a8d565b61062f565b60405190151581526020016101f4565b610228610640565b6040516101f49190612c7d565b61024861024336600461290f565b6106d2565b6040516001600160a01b0390911681526020016101f4565b61027361026e3660046128e5565b61076c565b005b610273610283366004612a11565b610882565b6099545b6040519081526020016101f4565b6102736102a83660046127f1565b610a16565b61028c6102bb3660046128e5565b610a47565b6102736102ce366004612a11565b610add565b6102736102e13660046127f1565b610bde565b61028c6102f436600461290f565b610bf9565b610228610c8c565b61027361030f366004612928565b610c9c565b61024861032236600461290f565b610de6565b61033a61033536600461290f565b610e5d565b6040516101f49190612bb2565b61028c61035536600461279c565b610e78565b610273610eff565b610273610fb7565b61022861106f565b61038561038036600461290f565b61107e565b6040516101f49493929190612c14565b6102736103a33660046128a9565b611158565b6102736103b636600461282d565b61121d565b6102736103c936600461290f565b611255565b6102286103dc36600461290f565b611355565b61028c6103ef36600461290f565b600090815260c9602052604090205490565b61027361040f366004612928565b61142e565b6101e7611578565b61021061042a3660046127be565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b606060008267ffffffffffffffff81111561047557610475612ea5565b60405190808252806020026020018201604052801561049e578160200160208202803683370190505b509050600080855b60cc54811080156104bf57506104bc8688612db2565b81105b156105555760cc81815481106104d7576104d7612e8f565b90600052602060002001548484815181106104f4576104f4612e8f565b6020026020010181815250506000801b60cc828154811061051757610517612e8f565b906000526020600020015414610535578161053181612e48565b9250505b8261053f81612e48565b935050808061054d90612e48565b9150506104a6565b508067ffffffffffffffff81111561056f5761056f612ea5565b604051908082528060200260200182016040528015610598578160200160208202803683370190505b5093506000915060005b8351811015610625576000801b8482815181106105c1576105c1612e8f565b602002602001015114610613578381815181106105e0576105e0612e8f565b60200260200101518584815181106105fa576105fa612e8f565b60209081029190910101528261060f81612e48565b9350505b8061061d81612e48565b9150506105a2565b5050505092915050565b600061063a826115cf565b92915050565b60606065805461064f90612e0d565b80601f016020809104026020016040519081016040528092919081815260200182805461067b90612e0d565b80156106c85780601f1061069d576101008083540402835291602001916106c8565b820191906000526020600020905b8154815290600101906020018083116106ab57829003601f168201915b5050505050905090565b6000818152606760205260408120546001600160a01b03166107505760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152606960205260409020546001600160a01b031690565b600061077782610de6565b9050806001600160a01b0316836001600160a01b031614156107e55760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610747565b336001600160a01b03821614806108015750610801813361042a565b6108735760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610747565b61087d83836115f4565b505050565b806108a057604051633f0e0a7f60e21b815260040160405180910390fd5b6000336040516bffffffffffffffffffffffff19606083901b1660208201526034810186905290915060009060540160408051601f19818403018152918152815160209283012060cc8054600181019091557f47197230e1e4b29fc0bd84d7d78966c0925452aff72a2a121538b102457e9ebe01819055600081815260c990935291205490915015610948576040516358dc901360e01b815260048101829052602401610747565b600061095360995490565b61095e906001612db2565b905061096a8382611662565b600082815260c96020908152604080832084905583835260ca825280832085905560cb909152902061099d9086866125af565b506040516001600160a01b0384169083907f49422f7ad2eca08595f1596952d2d805b5d5ba06f8c371dcb617c86a5b42ba0790600090a3817f4e0249d19860daeb2f0627d804cc93426e237cb754fef478c3a6cbcbc27626578686604051610a06929190612c4e565b60405180910390a2505050505050565b610a203382611680565b610a3c5760405162461bcd60e51b815260040161074790612d30565b61087d838383611777565b6000610a5283610e78565b8210610ab45760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610747565b506001600160a01b03919091166000908152609760209081526040808320938352929052205490565b82801580610af75750600081815260c96020526040902054155b15610b18576040516387fe3aad60e01b815260048101829052602401610747565b600081815260c960205260409020543390610b3290610de6565b6001600160a01b031614610b5957604051635612e54f60e11b815260040160405180910390fd5b81610b7757604051633f0e0a7f60e21b815260040160405180910390fd5b600084815260c96020908152604080832054835260cb9091529020610b9d9084846125af565b50837f4e0249d19860daeb2f0627d804cc93426e237cb754fef478c3a6cbcbc27626578484604051610bd0929190612c4e565b60405180910390a250505050565b61087d8383836040518060200160405280600081525061121d565b6000610c0460995490565b8210610c675760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610747565b60998281548110610c7a57610c7a612e8f565b90600052602060002001549050919050565b6060610134805461064f90612e0d565b81801580610cb65750600081815260c96020526040902054155b15610cd7576040516387fe3aad60e01b815260048101829052602401610747565b600081815260c960205260409020543390610cf190610de6565b6001600160a01b031614610d1857604051635612e54f60e11b815260040160405180910390fd5b8151610d3757604051634816a76760e01b815260040160405180910390fd5b6000805b8351811015610db557610d83848281518110610d5957610d59612e8f565b6020026020010151610100600088815260200190815260200160002061192290919063ffffffff16565b915081610da357604051634816a76760e01b815260040160405180910390fd5b80610dad81612e48565b915050610d3b565b50837f9af1bf1f55d94dc29bfe249a6e5c1f9b82c06fee0cdaeada46f044b69f68c7cc84604051610bd09190612bb2565b6000818152606760205260408120546001600160a01b03168061063a5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610747565b60008181526101006020526040902060609061063a906119bd565b60006001600160a01b038216610ee35760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610747565b506001600160a01b031660009081526068602052604090205490565b7fded1bc4b362adace04037b7f4031e750ed9c50f2b9d021df6a563f7277b743cf60008190526101016020527f154de1e2f0d12a95d70575f306499a7207e336b3faf6530768c03baf015982db5460ff1615610f7057604051625c34b160e11b815260048101829052602401610747565b604080518082019091526002808252612b1960f11b6020909201918252610f9a9161013491612633565b50600090815261010160205260409020805460ff19166001179055565b600054610100900460ff1680610fd0575060005460ff16155b610fec5760405162461bcd60e51b815260040161074790612ce2565b600054610100900460ff1615801561100e576000805461ffff19166101011790555b6110526040518060400160405280600581526020016413d491da5160da1b8152506040518060400160405280600581526020016413d491da5160da1b815250611a9a565b61105a611b21565b801561106c576000805461ff00191690555b50565b60606066805461064f90612e0d565b600081815260ca602090815260408083205460679092528220546001600160a01b03161580159260609161115157600085815260cb6020526040902080546110c590612e0d565b80601f01602080910402602001604051908101604052809291908181526020018280546110f190612e0d565b801561113e5780601f106111135761010080835404028352916020019161113e565b820191906000526020600020905b81548152906001019060200180831161112157829003601f168201915b5050505050915061114e85610de6565b90505b9193509193565b6001600160a01b0382163314156111b15760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610747565b336000818152606a602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6112273383611680565b6112435760405162461bcd60e51b815260040161074790612d30565b61124f84848484611b80565b50505050565b8080158061126f5750600081815260c96020526040902054155b15611290576040516387fe3aad60e01b815260048101829052602401610747565b600081815260c9602052604090205433906112aa90610de6565b6001600160a01b0316146112d157604051635612e54f60e11b815260040160405180910390fd5b6000828152610100602052604081206112e9906119bd565b6000848152610100602052604081209192509061130590611bb3565b90508061132557604051634816a76760e01b815260040160405180910390fd5b837fb3c3b87d0ea8237b590c2dbf7d3acf90e54a40cf0ef1e4c0d948736e1fabd8a983604051610bd09190612bb2565b6000818152606760205260409020546060906001600160a01b0316611390576040516306caeb1360e41b815260048101839052602401610747565b600082815260cb6020526040902080546113a990612e0d565b80601f01602080910402602001604051908101604052809291908181526020018280546113d590612e0d565b80156114225780601f106113f757610100808354040283529160200191611422565b820191906000526020600020905b81548152906001019060200180831161140557829003601f168201915b50505050509050919050565b818015806114485750600081815260c96020526040902054155b15611469576040516387fe3aad60e01b815260048101829052602401610747565b600081815260c96020526040902054339061148390610de6565b6001600160a01b0316146114aa57604051635612e54f60e11b815260040160405180910390fd5b81516114c957604051634816a76760e01b815260040160405180910390fd5b6000805b8351811015611547576115158482815181106114eb576114eb612e8f565b60200260200101516101006000888152602001908152602001600020611cd790919063ffffffff16565b91508161153557604051634816a76760e01b815260040160405180910390fd5b8061153f81612e48565b9150506114cd565b50837fb3c3b87d0ea8237b590c2dbf7d3acf90e54a40cf0ef1e4c0d948736e1fabd8a984604051610bd09190612bb2565b606060cc8054806020026020016040519081016040528092919081815260200182805480156106c857602002820191906000526020600020905b8154815260200190600101908083116115b2575050505050905090565b60006001600160e01b03198216635deabe7760e01b148061063a575061063a82611ea1565b600081815260696020526040902080546001600160a01b0319166001600160a01b038416908117909155819061162982610de6565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b61167c828260405180602001604052806000815250611ec6565b5050565b6000818152606760205260408120546001600160a01b03166116f95760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610747565b600061170483610de6565b9050806001600160a01b0316846001600160a01b0316148061173f5750836001600160a01b0316611734846106d2565b6001600160a01b0316145b8061176f57506001600160a01b038082166000908152606a602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b031661178a82610de6565b6001600160a01b0316146117f25760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610747565b6001600160a01b0382166118545760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610747565b61185f838383611ef9565b61186a6000826115f4565b6001600160a01b0383166000908152606860205260408120805460019290611893908490612dca565b90915550506001600160a01b03821660009081526068602052604081208054600192906118c1908490612db2565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b60008151600014156119365750600061063a565b600061194183611fb1565b600081815260018601602052604090205490915060ff166119b3576000818152600185810160209081526040808420805460ff191684179055875460028901835290842081905591820187558683529182902085516119a893919092019190860190612633565b50600191505061063a565b600091505061063a565b606081600001805480602002602001604051908101604052809291908181526020016000905b82821015611a8f578382906000526020600020018054611a0290612e0d565b80601f0160208091040260200160405190810160405280929190818152602001828054611a2e90612e0d565b8015611a7b5780601f10611a5057610100808354040283529160200191611a7b565b820191906000526020600020905b815481529060010190602001808311611a5e57829003601f168201915b5050505050815260200190600101906119e3565b505050509050919050565b600054610100900460ff1680611ab3575060005460ff16155b611acf5760405162461bcd60e51b815260040161074790612ce2565b600054610100900460ff16158015611af1576000805461ffff19166101011790555b611af9611fe1565b611b01611fe1565b611b0b838361204b565b801561087d576000805461ff0019169055505050565b600054610100900460ff1680611b3a575060005460ff16155b611b565760405162461bcd60e51b815260040161074790612ce2565b600054610100900460ff16158015611b78576000805461ffff19166101011790555b61105a6120e0565b611b8b848484611777565b611b978484848461214f565b61124f5760405162461bcd60e51b815260040161074790612c90565b805460009015611cca576000805b8354811015611cb557611c7a846000018281548110611be257611be2612e8f565b906000526020600020018054611bf790612e0d565b80601f0160208091040260200160405190810160405280929190818152602001828054611c2390612e0d565b8015611c705780601f10611c4557610100808354040283529160200191611c70565b820191906000526020600020905b815481529060010190602001808311611c5357829003601f168201915b5050505050611fb1565b60008181526002860160209081526040808320839055600188019091529020805460ff19169055915080611cad81612e48565b915050611bc1565b50611cc18360006126a7565b50600192915050565b506000919050565b919050565b6000815160001415611ceb5750600061063a565b6000611cf683611fb1565b600081815260018601602052604090205490915060ff16156119b35760008181526002850160205260408120548554909190611d3490600190612dca565b9050818114611e40576000866000018281548110611d5457611d54612e8f565b906000526020600020018054611d6990612e0d565b80601f0160208091040260200160405190810160405280929190818152602001828054611d9590612e0d565b8015611de25780601f10611db757610100808354040283529160200191611de2565b820191906000526020600020905b815481529060010190602001808311611dc557829003601f168201915b5050505050905080876000018481548110611dff57611dff612e8f565b906000526020600020019080519060200190611e1c929190612633565b5082876002016000611e2d84611fb1565b8152602081019190915260400160002055505b8554869080611e5157611e51612e79565b600190038181906000526020600020016000611e6d91906126c5565b90555050600090815260028401602090815260408083208390556001808701909252909120805460ff19169055905061063a565b60006001600160e01b031982166345f8f68160e11b148061063a575061063a8261225c565b611ed08383612281565b611edd600084848461214f565b61087d5760405162461bcd60e51b815260040161074790612c90565b6001600160a01b038316611f5457611f4f81609980546000838152609a60205260408120829055600182018355919091527f72a152ddfb8e864297c917af52ea6c1c68aead0fee1a62673fcc7e0c94979d000155565b611f77565b816001600160a01b0316836001600160a01b031614611f7757611f7783826123cf565b6001600160a01b038216611f8e5761087d8161246c565b826001600160a01b0316826001600160a01b03161461087d5761087d828261251b565b600081604051602001611fc49190612b15565b604051602081830303815290604052805190602001209050919050565b600054610100900460ff1680611ffa575060005460ff16155b6120165760405162461bcd60e51b815260040161074790612ce2565b600054610100900460ff1615801561105a576000805461ffff1916610101179055801561106c576000805461ff001916905550565b600054610100900460ff1680612064575060005460ff16155b6120805760405162461bcd60e51b815260040161074790612ce2565b600054610100900460ff161580156120a2576000805461ffff19166101011790555b82516120b5906065906020860190612633565b5081516120c9906066906020850190612633565b50801561087d576000805461ff0019169055505050565b600054610100900460ff16806120f9575060005460ff16155b6121155760405162461bcd60e51b815260040161074790612ce2565b600054610100900460ff16158015612137576000805461ffff19166101011790555b61213f611fe1565b612147611fe1565b61105a611fe1565b60006001600160a01b0384163b1561225157604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612193903390899088908890600401612b31565b602060405180830381600087803b1580156121ad57600080fd5b505af19250505080156121dd575060408051601f3d908101601f191682019092526121da91810190612aaa565b60015b612237573d80801561220b576040519150601f19603f3d011682016040523d82523d6000602084013e612210565b606091505b50805161222f5760405162461bcd60e51b815260040161074790612c90565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061176f565b506001949350505050565b60006001600160e01b0319821663780e9d6360e01b148061063a575061063a8261255f565b6001600160a01b0382166122d75760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610747565b6000818152606760205260409020546001600160a01b03161561233c5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610747565b61234860008383611ef9565b6001600160a01b0382166000908152606860205260408120805460019290612371908490612db2565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b600060016123dc84610e78565b6123e69190612dca565b600083815260986020526040902054909150808214612439576001600160a01b03841660009081526097602090815260408083208584528252808320548484528184208190558352609890915290208190555b5060009182526098602090815260408084208490556001600160a01b039094168352609781528383209183525290812055565b60995460009061247e90600190612dca565b6000838152609a6020526040812054609980549394509092849081106124a6576124a6612e8f565b9060005260206000200154905080609983815481106124c7576124c7612e8f565b6000918252602080832090910192909255828152609a909152604080822084905585825281205560998054806124ff576124ff612e79565b6001900381819060005260206000200160009055905550505050565b600061252683610e78565b6001600160a01b039093166000908152609760209081526040808320868452825280832085905593825260989052919091209190915550565b60006001600160e01b031982166380ac58cd60e01b148061259057506001600160e01b03198216635b5e139f60e01b145b8061063a57506301ffc9a760e01b6001600160e01b031983161461063a565b8280546125bb90612e0d565b90600052602060002090601f0160209004810192826125dd5760008555612623565b82601f106125f65782800160ff19823516178555612623565b82800160010185558215612623579182015b82811115612623578235825591602001919060010190612608565b5061262f9291506126fb565b5090565b82805461263f90612e0d565b90600052602060002090601f0160209004810192826126615760008555612623565b82601f1061267a57805160ff1916838001178555612623565b82800160010185558215612623579182015b8281111561262357825182559160200191906001019061268c565b508054600082559060005260206000209081019061106c9190612710565b5080546126d190612e0d565b6000825580601f106126e1575050565b601f01602090049060005260206000209081019061106c91905b5b8082111561262f57600081556001016126fc565b8082111561262f57600061272482826126c5565b50600101612710565b600067ffffffffffffffff83111561274757612747612ea5565b61275a601f8401601f1916602001612d81565b905082815283838301111561276e57600080fd5b828260208301376000602084830101529392505050565b80356001600160a01b0381168114611cd257600080fd5b6000602082840312156127ae57600080fd5b6127b782612785565b9392505050565b600080604083850312156127d157600080fd5b6127da83612785565b91506127e860208401612785565b90509250929050565b60008060006060848603121561280657600080fd5b61280f84612785565b925061281d60208501612785565b9150604084013590509250925092565b6000806000806080858703121561284357600080fd5b61284c85612785565b935061285a60208601612785565b925060408501359150606085013567ffffffffffffffff81111561287d57600080fd5b8501601f8101871361288e57600080fd5b61289d8782356020840161272d565b91505092959194509250565b600080604083850312156128bc57600080fd5b6128c583612785565b9150602083013580151581146128da57600080fd5b809150509250929050565b600080604083850312156128f857600080fd5b61290183612785565b946020939093013593505050565b60006020828403121561292157600080fd5b5035919050565b600080604080848603121561293c57600080fd5b8335925060208085013567ffffffffffffffff8082111561295c57600080fd5b818701915087601f83011261297057600080fd5b81358181111561298257612982612ea5565b8060051b612991858201612d81565b8281528581019085870183870188018d10156129ac57600080fd5b600093505b848410156129fe578035868111156129c857600080fd5b8701603f81018e136129d957600080fd5b6129e98e8a8301358c840161272d565b845250600193909301929187019187016129b1565b5080985050505050505050509250929050565b600080600060408486031215612a2657600080fd5b83359250602084013567ffffffffffffffff80821115612a4557600080fd5b818601915086601f830112612a5957600080fd5b813581811115612a6857600080fd5b876020828501011115612a7a57600080fd5b6020830194508093505050509250925092565b600060208284031215612a9f57600080fd5b81356127b781612ebb565b600060208284031215612abc57600080fd5b81516127b781612ebb565b60008060408385031215612ada57600080fd5b50508035926020909101359150565b60008151808452612b01816020860160208601612de1565b601f01601f19169290920160200192915050565b60008251612b27818460208701612de1565b9190910192915050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090612b6490830184612ae9565b9695505050505050565b6020808252825182820181905260009190848201906040850190845b81811015612ba657835183529284019291840191600101612b8a565b50909695505050505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b82811015612c0757603f19888603018452612bf5858351612ae9565b94509285019290850190600101612bd9565b5092979650505050505050565b8415158152836020820152608060408201526000612c356080830185612ae9565b905060018060a01b038316606083015295945050505050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b6020815260006127b76020830184612ae9565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b604051601f8201601f1916810167ffffffffffffffff81118282101715612daa57612daa612ea5565b604052919050565b60008219821115612dc557612dc5612e63565b500190565b600082821015612ddc57612ddc612e63565b500390565b60005b83811015612dfc578181015183820152602001612de4565b8381111561124f5750506000910152565b600181811c90821680612e2157607f821691505b60208210811415612e4257634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415612e5c57612e5c612e63565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b03198116811461106c57600080fdfea164736f6c6343000807000a";

export class OrgIdUpgradeabilityTest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OrgIdUpgradeabilityTest> {
    return super.deploy(overrides || {}) as Promise<OrgIdUpgradeabilityTest>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): OrgIdUpgradeabilityTest {
    return super.attach(address) as OrgIdUpgradeabilityTest;
  }
  connect(signer: Signer): OrgIdUpgradeabilityTest__factory {
    return super.connect(signer) as OrgIdUpgradeabilityTest__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OrgIdUpgradeabilityTestInterface {
    return new utils.Interface(_abi) as OrgIdUpgradeabilityTestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OrgIdUpgradeabilityTest {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as OrgIdUpgradeabilityTest;
  }
}