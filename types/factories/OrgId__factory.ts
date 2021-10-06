/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { OrgId, OrgIdInterface } from "../OrgId";

const _abi = [
  {
    inputs: [],
    name: "CalledNotByOrgIdOwner",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612de0806100206000396000f3fe608060405234801561001057600080fd5b50600436106101a95760003560e01c80636352211e116100f9578063b88d4fde11610097578063c9cb65e111610071578063c9cb65e1146103ab578063dfe0f511146103cb578063e4f64990146103de578063e985e9c5146103e657600080fd5b8063b88d4fde14610372578063bc52570b14610385578063c87b56dd1461039857600080fd5b80638129fc1c116100d35780638129fc1c1461032c57806395d89b411461033457806398980a8a1461033c578063a22cb4651461035f57600080fd5b80636352211e146102e657806363ceab54146102f957806370a082311461031957600080fd5b806318160ddd1161016657806335178d911161014057806335178d911461029a57806342842e0e146102ad5780634f6ccce7146102c05780635d96b739146102d357600080fd5b806318160ddd1461026257806323b872dd146102745780632f745c591461028757600080fd5b80630193eda6146101ae57806301ffc9a7146101d757806306fdde03146101fa578063081812fc1461020f578063095ea7b31461023a5780630ad0abce1461024f575b600080fd5b6101c16101bc3660046129c9565b610422565b6040516101ce9190612a70565b60405180910390f35b6101ea6101e536600461298f565b6105f9565b60405190151581526020016101ce565b61020261060a565b6040516101ce9190612b7f565b61022261021d366004612811565b61069c565b6040516001600160a01b0390911681526020016101ce565b61024d6102483660046127e7565b610736565b005b61024d61025d366004612913565b61084c565b6099545b6040519081526020016101ce565b61024d6102823660046126f3565b6109e0565b6102666102953660046127e7565b610a11565b61024d6102a8366004612913565b610aa7565b61024d6102bb3660046126f3565b610ba8565b6102666102ce366004612811565b610bc3565b61024d6102e136600461282a565b610c56565b6102226102f4366004612811565b610da0565b61030c610307366004612811565b610e17565b6040516101ce9190612ab4565b61026661032736600461269e565b610e32565b61024d610eb9565b610202610f71565b61034f61034a366004612811565b610f80565b6040516101ce9493929190612b16565b61024d61036d3660046127ab565b61105a565b61024d61038036600461272f565b61111f565b61024d610393366004612811565b611157565b6102026103a6366004612811565b611257565b6102666103b9366004612811565b600090815260c9602052604090205490565b61024d6103d936600461282a565b611330565b6101c161147a565b6101ea6103f43660046126c0565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b606060008267ffffffffffffffff81111561043f5761043f612da7565b604051908082528060200260200182016040528015610468578160200160208202803683370190505b509050600080855b60cc548110801561048957506104868688612cb4565b81105b1561051f5760cc81815481106104a1576104a1612d91565b90600052602060002001548484815181106104be576104be612d91565b6020026020010181815250506000801b60cc82815481106104e1576104e1612d91565b9060005260206000200154146104ff57816104fb81612d4a565b9250505b8261050981612d4a565b935050808061051790612d4a565b915050610470565b508067ffffffffffffffff81111561053957610539612da7565b604051908082528060200260200182016040528015610562578160200160208202803683370190505b5093506000915060005b83518110156105ef576000801b84828151811061058b5761058b612d91565b6020026020010151146105dd578381815181106105aa576105aa612d91565b60200260200101518584815181106105c4576105c4612d91565b6020908102919091010152826105d981612d4a565b9350505b806105e781612d4a565b91505061056c565b5050505092915050565b6000610604826114d1565b92915050565b60606065805461061990612d0f565b80601f016020809104026020016040519081016040528092919081815260200182805461064590612d0f565b80156106925780601f1061066757610100808354040283529160200191610692565b820191906000526020600020905b81548152906001019060200180831161067557829003601f168201915b5050505050905090565b6000818152606760205260408120546001600160a01b031661071a5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152606960205260409020546001600160a01b031690565b600061074182610da0565b9050806001600160a01b0316836001600160a01b031614156107af5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610711565b336001600160a01b03821614806107cb57506107cb81336103f4565b61083d5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610711565b61084783836114f6565b505050565b8061086a57604051633f0e0a7f60e21b815260040160405180910390fd5b6000336040516bffffffffffffffffffffffff19606083901b1660208201526034810186905290915060009060540160408051601f19818403018152918152815160209283012060cc8054600181019091557f47197230e1e4b29fc0bd84d7d78966c0925452aff72a2a121538b102457e9ebe01819055600081815260c990935291205490915015610912576040516358dc901360e01b815260048101829052602401610711565b600061091d60995490565b610928906001612cb4565b90506109348382611564565b600082815260c96020908152604080832084905583835260ca825280832085905560cb90915290206109679086866124b1565b506040516001600160a01b0384169083907f49422f7ad2eca08595f1596952d2d805b5d5ba06f8c371dcb617c86a5b42ba0790600090a3817f4e0249d19860daeb2f0627d804cc93426e237cb754fef478c3a6cbcbc276265786866040516109d0929190612b50565b60405180910390a2505050505050565b6109ea3382611582565b610a065760405162461bcd60e51b815260040161071190612c32565b610847838383611679565b6000610a1c83610e32565b8210610a7e5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610711565b506001600160a01b03919091166000908152609760209081526040808320938352929052205490565b82801580610ac15750600081815260c96020526040902054155b15610ae2576040516387fe3aad60e01b815260048101829052602401610711565b600081815260c960205260409020543390610afc90610da0565b6001600160a01b031614610b2357604051635612e54f60e11b815260040160405180910390fd5b81610b4157604051633f0e0a7f60e21b815260040160405180910390fd5b600084815260c96020908152604080832054835260cb9091529020610b679084846124b1565b50837f4e0249d19860daeb2f0627d804cc93426e237cb754fef478c3a6cbcbc27626578484604051610b9a929190612b50565b60405180910390a250505050565b6108478383836040518060200160405280600081525061111f565b6000610bce60995490565b8210610c315760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610711565b60998281548110610c4457610c44612d91565b90600052602060002001549050919050565b81801580610c705750600081815260c96020526040902054155b15610c91576040516387fe3aad60e01b815260048101829052602401610711565b600081815260c960205260409020543390610cab90610da0565b6001600160a01b031614610cd257604051635612e54f60e11b815260040160405180910390fd5b8151610cf157604051634816a76760e01b815260040160405180910390fd5b6000805b8351811015610d6f57610d3d848281518110610d1357610d13612d91565b6020026020010151610100600088815260200190815260200160002061182490919063ffffffff16565b915081610d5d57604051634816a76760e01b815260040160405180910390fd5b80610d6781612d4a565b915050610cf5565b50837f9af1bf1f55d94dc29bfe249a6e5c1f9b82c06fee0cdaeada46f044b69f68c7cc84604051610b9a9190612ab4565b6000818152606760205260408120546001600160a01b0316806106045760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610711565b600081815261010060205260409020606090610604906118bf565b60006001600160a01b038216610e9d5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610711565b506001600160a01b031660009081526068602052604090205490565b600054610100900460ff1680610ed2575060005460ff16155b610eee5760405162461bcd60e51b815260040161071190612be4565b600054610100900460ff16158015610f10576000805461ffff19166101011790555b610f546040518060400160405280600581526020016413d491da5160da1b8152506040518060400160405280600581526020016413d491da5160da1b81525061199c565b610f5c611a23565b8015610f6e576000805461ff00191690555b50565b60606066805461061990612d0f565b600081815260ca602090815260408083205460679092528220546001600160a01b03161580159260609161105357600085815260cb602052604090208054610fc790612d0f565b80601f0160208091040260200160405190810160405280929190818152602001828054610ff390612d0f565b80156110405780601f1061101557610100808354040283529160200191611040565b820191906000526020600020905b81548152906001019060200180831161102357829003601f168201915b5050505050915061105085610da0565b90505b9193509193565b6001600160a01b0382163314156110b35760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610711565b336000818152606a602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6111293383611582565b6111455760405162461bcd60e51b815260040161071190612c32565b61115184848484611a82565b50505050565b808015806111715750600081815260c96020526040902054155b15611192576040516387fe3aad60e01b815260048101829052602401610711565b600081815260c9602052604090205433906111ac90610da0565b6001600160a01b0316146111d357604051635612e54f60e11b815260040160405180910390fd5b6000828152610100602052604081206111eb906118bf565b6000848152610100602052604081209192509061120790611ab5565b90508061122757604051634816a76760e01b815260040160405180910390fd5b837fb3c3b87d0ea8237b590c2dbf7d3acf90e54a40cf0ef1e4c0d948736e1fabd8a983604051610b9a9190612ab4565b6000818152606760205260409020546060906001600160a01b0316611292576040516306caeb1360e41b815260048101839052602401610711565b600082815260cb6020526040902080546112ab90612d0f565b80601f01602080910402602001604051908101604052809291908181526020018280546112d790612d0f565b80156113245780601f106112f957610100808354040283529160200191611324565b820191906000526020600020905b81548152906001019060200180831161130757829003601f168201915b50505050509050919050565b8180158061134a5750600081815260c96020526040902054155b1561136b576040516387fe3aad60e01b815260048101829052602401610711565b600081815260c96020526040902054339061138590610da0565b6001600160a01b0316146113ac57604051635612e54f60e11b815260040160405180910390fd5b81516113cb57604051634816a76760e01b815260040160405180910390fd5b6000805b8351811015611449576114178482815181106113ed576113ed612d91565b60200260200101516101006000888152602001908152602001600020611bd990919063ffffffff16565b91508161143757604051634816a76760e01b815260040160405180910390fd5b8061144181612d4a565b9150506113cf565b50837fb3c3b87d0ea8237b590c2dbf7d3acf90e54a40cf0ef1e4c0d948736e1fabd8a984604051610b9a9190612ab4565b606060cc80548060200260200160405190810160405280929190818152602001828054801561069257602002820191906000526020600020905b8154815260200190600101908083116114b4575050505050905090565b60006001600160e01b03198216635deabe7760e01b1480610604575061060482611da3565b600081815260696020526040902080546001600160a01b0319166001600160a01b038416908117909155819061152b82610da0565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b61157e828260405180602001604052806000815250611dc8565b5050565b6000818152606760205260408120546001600160a01b03166115fb5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610711565b600061160683610da0565b9050806001600160a01b0316846001600160a01b031614806116415750836001600160a01b03166116368461069c565b6001600160a01b0316145b8061167157506001600160a01b038082166000908152606a602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b031661168c82610da0565b6001600160a01b0316146116f45760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610711565b6001600160a01b0382166117565760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610711565b611761838383611dfb565b61176c6000826114f6565b6001600160a01b0383166000908152606860205260408120805460019290611795908490612ccc565b90915550506001600160a01b03821660009081526068602052604081208054600192906117c3908490612cb4565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b600081516000141561183857506000610604565b600061184383611eb3565b600081815260018601602052604090205490915060ff166118b5576000818152600185810160209081526040808420805460ff191684179055875460028901835290842081905591820187558683529182902085516118aa93919092019190860190612535565b506001915050610604565b6000915050610604565b606081600001805480602002602001604051908101604052809291908181526020016000905b8282101561199157838290600052602060002001805461190490612d0f565b80601f016020809104026020016040519081016040528092919081815260200182805461193090612d0f565b801561197d5780601f106119525761010080835404028352916020019161197d565b820191906000526020600020905b81548152906001019060200180831161196057829003601f168201915b5050505050815260200190600101906118e5565b505050509050919050565b600054610100900460ff16806119b5575060005460ff16155b6119d15760405162461bcd60e51b815260040161071190612be4565b600054610100900460ff161580156119f3576000805461ffff19166101011790555b6119fb611ee3565b611a03611ee3565b611a0d8383611f4d565b8015610847576000805461ff0019169055505050565b600054610100900460ff1680611a3c575060005460ff16155b611a585760405162461bcd60e51b815260040161071190612be4565b600054610100900460ff16158015611a7a576000805461ffff19166101011790555b610f5c611fe2565b611a8d848484611679565b611a9984848484612051565b6111515760405162461bcd60e51b815260040161071190612b92565b805460009015611bcc576000805b8354811015611bb757611b7c846000018281548110611ae457611ae4612d91565b906000526020600020018054611af990612d0f565b80601f0160208091040260200160405190810160405280929190818152602001828054611b2590612d0f565b8015611b725780601f10611b4757610100808354040283529160200191611b72565b820191906000526020600020905b815481529060010190602001808311611b5557829003601f168201915b5050505050611eb3565b60008181526002860160209081526040808320839055600188019091529020805460ff19169055915080611baf81612d4a565b915050611ac3565b50611bc38360006125a9565b50600192915050565b506000919050565b919050565b6000815160001415611bed57506000610604565b6000611bf883611eb3565b600081815260018601602052604090205490915060ff16156118b55760008181526002850160205260408120548554909190611c3690600190612ccc565b9050818114611d42576000866000018281548110611c5657611c56612d91565b906000526020600020018054611c6b90612d0f565b80601f0160208091040260200160405190810160405280929190818152602001828054611c9790612d0f565b8015611ce45780601f10611cb957610100808354040283529160200191611ce4565b820191906000526020600020905b815481529060010190602001808311611cc757829003601f168201915b5050505050905080876000018481548110611d0157611d01612d91565b906000526020600020019080519060200190611d1e929190612535565b5082876002016000611d2f84611eb3565b8152602081019190915260400160002055505b8554869080611d5357611d53612d7b565b600190038181906000526020600020016000611d6f91906125c7565b90555050600090815260028401602090815260408083208390556001808701909252909120805460ff191690559050610604565b60006001600160e01b031982166345f8f68160e11b148061060457506106048261215e565b611dd28383612183565b611ddf6000848484612051565b6108475760405162461bcd60e51b815260040161071190612b92565b6001600160a01b038316611e5657611e5181609980546000838152609a60205260408120829055600182018355919091527f72a152ddfb8e864297c917af52ea6c1c68aead0fee1a62673fcc7e0c94979d000155565b611e79565b816001600160a01b0316836001600160a01b031614611e7957611e7983826122d1565b6001600160a01b038216611e90576108478161236e565b826001600160a01b0316826001600160a01b03161461084757610847828261241d565b600081604051602001611ec69190612a17565b604051602081830303815290604052805190602001209050919050565b600054610100900460ff1680611efc575060005460ff16155b611f185760405162461bcd60e51b815260040161071190612be4565b600054610100900460ff16158015610f5c576000805461ffff19166101011790558015610f6e576000805461ff001916905550565b600054610100900460ff1680611f66575060005460ff16155b611f825760405162461bcd60e51b815260040161071190612be4565b600054610100900460ff16158015611fa4576000805461ffff19166101011790555b8251611fb7906065906020860190612535565b508151611fcb906066906020850190612535565b508015610847576000805461ff0019169055505050565b600054610100900460ff1680611ffb575060005460ff16155b6120175760405162461bcd60e51b815260040161071190612be4565b600054610100900460ff16158015612039576000805461ffff19166101011790555b612041611ee3565b612049611ee3565b610f5c611ee3565b60006001600160a01b0384163b1561215357604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612095903390899088908890600401612a33565b602060405180830381600087803b1580156120af57600080fd5b505af19250505080156120df575060408051601f3d908101601f191682019092526120dc918101906129ac565b60015b612139573d80801561210d576040519150601f19603f3d011682016040523d82523d6000602084013e612112565b606091505b5080516121315760405162461bcd60e51b815260040161071190612b92565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050611671565b506001949350505050565b60006001600160e01b0319821663780e9d6360e01b1480610604575061060482612461565b6001600160a01b0382166121d95760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610711565b6000818152606760205260409020546001600160a01b03161561223e5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610711565b61224a60008383611dfb565b6001600160a01b0382166000908152606860205260408120805460019290612273908490612cb4565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b600060016122de84610e32565b6122e89190612ccc565b60008381526098602052604090205490915080821461233b576001600160a01b03841660009081526097602090815260408083208584528252808320548484528184208190558352609890915290208190555b5060009182526098602090815260408084208490556001600160a01b039094168352609781528383209183525290812055565b60995460009061238090600190612ccc565b6000838152609a6020526040812054609980549394509092849081106123a8576123a8612d91565b9060005260206000200154905080609983815481106123c9576123c9612d91565b6000918252602080832090910192909255828152609a9091526040808220849055858252812055609980548061240157612401612d7b565b6001900381819060005260206000200160009055905550505050565b600061242883610e32565b6001600160a01b039093166000908152609760209081526040808320868452825280832085905593825260989052919091209190915550565b60006001600160e01b031982166380ac58cd60e01b148061249257506001600160e01b03198216635b5e139f60e01b145b8061060457506301ffc9a760e01b6001600160e01b0319831614610604565b8280546124bd90612d0f565b90600052602060002090601f0160209004810192826124df5760008555612525565b82601f106124f85782800160ff19823516178555612525565b82800160010185558215612525579182015b8281111561252557823582559160200191906001019061250a565b506125319291506125fd565b5090565b82805461254190612d0f565b90600052602060002090601f0160209004810192826125635760008555612525565b82601f1061257c57805160ff1916838001178555612525565b82800160010185558215612525579182015b8281111561252557825182559160200191906001019061258e565b5080546000825590600052602060002090810190610f6e9190612612565b5080546125d390612d0f565b6000825580601f106125e3575050565b601f016020900490600052602060002090810190610f6e91905b5b8082111561253157600081556001016125fe565b8082111561253157600061262682826125c7565b50600101612612565b600067ffffffffffffffff83111561264957612649612da7565b61265c601f8401601f1916602001612c83565b905082815283838301111561267057600080fd5b828260208301376000602084830101529392505050565b80356001600160a01b0381168114611bd457600080fd5b6000602082840312156126b057600080fd5b6126b982612687565b9392505050565b600080604083850312156126d357600080fd5b6126dc83612687565b91506126ea60208401612687565b90509250929050565b60008060006060848603121561270857600080fd5b61271184612687565b925061271f60208501612687565b9150604084013590509250925092565b6000806000806080858703121561274557600080fd5b61274e85612687565b935061275c60208601612687565b925060408501359150606085013567ffffffffffffffff81111561277f57600080fd5b8501601f8101871361279057600080fd5b61279f8782356020840161262f565b91505092959194509250565b600080604083850312156127be57600080fd5b6127c783612687565b9150602083013580151581146127dc57600080fd5b809150509250929050565b600080604083850312156127fa57600080fd5b61280383612687565b946020939093013593505050565b60006020828403121561282357600080fd5b5035919050565b600080604080848603121561283e57600080fd5b8335925060208085013567ffffffffffffffff8082111561285e57600080fd5b818701915087601f83011261287257600080fd5b81358181111561288457612884612da7565b8060051b612893858201612c83565b8281528581019085870183870188018d10156128ae57600080fd5b600093505b84841015612900578035868111156128ca57600080fd5b8701603f81018e136128db57600080fd5b6128eb8e8a8301358c840161262f565b845250600193909301929187019187016128b3565b5080985050505050505050509250929050565b60008060006040848603121561292857600080fd5b83359250602084013567ffffffffffffffff8082111561294757600080fd5b818601915086601f83011261295b57600080fd5b81358181111561296a57600080fd5b87602082850101111561297c57600080fd5b6020830194508093505050509250925092565b6000602082840312156129a157600080fd5b81356126b981612dbd565b6000602082840312156129be57600080fd5b81516126b981612dbd565b600080604083850312156129dc57600080fd5b50508035926020909101359150565b60008151808452612a03816020860160208601612ce3565b601f01601f19169290920160200192915050565b60008251612a29818460208701612ce3565b9190910192915050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090612a66908301846129eb565b9695505050505050565b6020808252825182820181905260009190848201906040850190845b81811015612aa857835183529284019291840191600101612a8c565b50909695505050505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b82811015612b0957603f19888603018452612af78583516129eb565b94509285019290850190600101612adb565b5092979650505050505050565b8415158152836020820152608060408201526000612b3760808301856129eb565b905060018060a01b038316606083015295945050505050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b6020815260006126b960208301846129eb565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b604051601f8201601f1916810167ffffffffffffffff81118282101715612cac57612cac612da7565b604052919050565b60008219821115612cc757612cc7612d65565b500190565b600082821015612cde57612cde612d65565b500390565b60005b83811015612cfe578181015183820152602001612ce6565b838111156111515750506000910152565b600181811c90821680612d2357607f821691505b60208210811415612d4457634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415612d5e57612d5e612d65565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b031981168114610f6e57600080fdfea164736f6c6343000807000a";

export class OrgId__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OrgId> {
    return super.deploy(overrides || {}) as Promise<OrgId>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): OrgId {
    return super.attach(address) as OrgId;
  }
  connect(signer: Signer): OrgId__factory {
    return super.connect(signer) as OrgId__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OrgIdInterface {
    return new utils.Interface(_abi) as OrgIdInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): OrgId {
    return new Contract(address, _abi, signerOrProvider) as OrgId;
  }
}