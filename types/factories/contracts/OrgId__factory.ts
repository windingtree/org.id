/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { OrgId, OrgIdInterface } from "../../contracts/OrgId";

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
  "0x608060405234801561001057600080fd5b50612edc806100206000396000f3fe608060405234801561001057600080fd5b50600436106101a95760003560e01c80636352211e116100f9578063b88d4fde11610097578063c9cb65e111610071578063c9cb65e1146103ab578063dfe0f511146103cb578063e4f64990146103de578063e985e9c5146103e657600080fd5b8063b88d4fde14610372578063bc52570b14610385578063c87b56dd1461039857600080fd5b80638129fc1c116100d35780638129fc1c1461032c57806395d89b411461033457806398980a8a1461033c578063a22cb4651461035f57600080fd5b80636352211e146102e657806363ceab54146102f957806370a082311461031957600080fd5b806318160ddd1161016657806335178d911161014057806335178d911461029a57806342842e0e146102ad5780634f6ccce7146102c05780635d96b739146102d357600080fd5b806318160ddd1461026257806323b872dd146102745780632f745c591461028757600080fd5b80630193eda6146101ae57806301ffc9a7146101d757806306fdde03146101fa578063081812fc1461020f578063095ea7b31461023a5780630ad0abce1461024f575b600080fd5b6101c16101bc36600461254b565b610422565b6040516101ce919061256d565b60405180910390f35b6101ea6101e53660046125c7565b6105f9565b60405190151581526020016101ce565b61020261060a565b6040516101ce919061263b565b61022261021d36600461264e565b61069c565b6040516001600160a01b0390911681526020016101ce565b61024d61024836600461267e565b610736565b005b61024d61025d3660046126a8565b61084b565b6099545b6040519081526020016101ce565b61024d610282366004612724565b6109e3565b61026661029536600461267e565b610a14565b61024d6102a83660046126a8565b610aaa565b61024d6102bb366004612724565b610baf565b6102666102ce36600461264e565b610bca565b61024d6102e13660046127ff565b610c5d565b6102226102f436600461264e565b610daa565b61030c61030736600461264e565b610e21565b6040516101ce91906128e4565b610266610327366004612946565b610e3c565b61024d610ec3565b610202610f7b565b61034f61034a36600461264e565b610f8a565b6040516101ce9493929190612961565b61024d61036d36600461299b565b611064565b61024d6103803660046129d7565b611128565b61024d61039336600461264e565b611160565b6102026103a636600461264e565b611260565b6102666103b936600461264e565b600090815260c9602052604090205490565b61024d6103d93660046127ff565b611339565b6101c1611486565b6101ea6103f4366004612a53565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b606060008267ffffffffffffffff81111561043f5761043f612760565b604051908082528060200260200182016040528015610468578160200160208202803683370190505b509050600080855b60cc548110801561048957506104868688612a9c565b81105b1561051f5760cc81815481106104a1576104a1612aaf565b90600052602060002001548484815181106104be576104be612aaf565b6020026020010181815250506000801b60cc82815481106104e1576104e1612aaf565b9060005260206000200154146104ff57816104fb81612ac5565b9250505b8261050981612ac5565b935050808061051790612ac5565b915050610470565b508067ffffffffffffffff81111561053957610539612760565b604051908082528060200260200182016040528015610562578160200160208202803683370190505b5093506000915060005b83518110156105ef576000801b84828151811061058b5761058b612aaf565b6020026020010151146105dd578381815181106105aa576105aa612aaf565b60200260200101518584815181106105c4576105c4612aaf565b6020908102919091010152826105d981612ac5565b9350505b806105e781612ac5565b91505061056c565b5050505092915050565b6000610604826114dd565b92915050565b60606065805461061990612ade565b80601f016020809104026020016040519081016040528092919081815260200182805461064590612ade565b80156106925780601f1061066757610100808354040283529160200191610692565b820191906000526020600020905b81548152906001019060200180831161067557829003601f168201915b5050505050905090565b6000818152606760205260408120546001600160a01b031661071a5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152606960205260409020546001600160a01b031690565b600061074182610daa565b9050806001600160a01b0316836001600160a01b0316036107ae5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610711565b336001600160a01b03821614806107ca57506107ca81336103f4565b61083c5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610711565b6108468383611502565b505050565b600081900361086d57604051633f0e0a7f60e21b815260040160405180910390fd5b6000336040516bffffffffffffffffffffffff19606083901b1660208201526034810186905290915060009060540160408051601f19818403018152918152815160209283012060cc8054600181019091557f47197230e1e4b29fc0bd84d7d78966c0925452aff72a2a121538b102457e9ebe01819055600081815260c990935291205490915015610915576040516358dc901360e01b815260048101829052602401610711565b600061092060995490565b61092b906001612a9c565b90506109378382611570565b600082815260c96020908152604080832084905583835260ca825280832085905560cb909152902061096a858783612b66565b506040516001600160a01b0384169083907f49422f7ad2eca08595f1596952d2d805b5d5ba06f8c371dcb617c86a5b42ba0790600090a3817f4e0249d19860daeb2f0627d804cc93426e237cb754fef478c3a6cbcbc276265786866040516109d3929190612c27565b60405180910390a2505050505050565b6109ed338261158e565b610a095760405162461bcd60e51b815260040161071190612c56565b610846838383611685565b6000610a1f83610e3c565b8210610a815760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610711565b506001600160a01b03919091166000908152609760209081526040808320938352929052205490565b82801580610ac45750600081815260c96020526040902054155b15610ae5576040516387fe3aad60e01b815260048101829052602401610711565b600081815260c960205260409020543390610aff90610daa565b6001600160a01b031614610b2657604051635612e54f60e11b815260040160405180910390fd5b6000829003610b4857604051633f0e0a7f60e21b815260040160405180910390fd5b600084815260c96020908152604080832054835260cb9091529020610b6e838583612b66565b50837f4e0249d19860daeb2f0627d804cc93426e237cb754fef478c3a6cbcbc27626578484604051610ba1929190612c27565b60405180910390a250505050565b61084683838360405180602001604052806000815250611128565b6000610bd560995490565b8210610c385760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610711565b60998281548110610c4b57610c4b612aaf565b90600052602060002001549050919050565b81801580610c775750600081815260c96020526040902054155b15610c98576040516387fe3aad60e01b815260048101829052602401610711565b600081815260c960205260409020543390610cb290610daa565b6001600160a01b031614610cd957604051635612e54f60e11b815260040160405180910390fd5b8151600003610cfb57604051634816a76760e01b815260040160405180910390fd5b6000805b8351811015610d7957610d47848281518110610d1d57610d1d612aaf565b6020026020010151610100600088815260200190815260200160002061183090919063ffffffff16565b915081610d6757604051634816a76760e01b815260040160405180910390fd5b80610d7181612ac5565b915050610cff565b50837f9af1bf1f55d94dc29bfe249a6e5c1f9b82c06fee0cdaeada46f044b69f68c7cc84604051610ba191906128e4565b6000818152606760205260408120546001600160a01b0316806106045760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610711565b600081815261010060205260409020606090610604906118d1565b60006001600160a01b038216610ea75760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610711565b506001600160a01b031660009081526068602052604090205490565b600054610100900460ff1680610edc575060005460ff16155b610ef85760405162461bcd60e51b815260040161071190612ca7565b600054610100900460ff16158015610f1a576000805461ffff19166101011790555b610f5e6040518060400160405280600581526020016413d491da5160da1b8152506040518060400160405280600581526020016413d491da5160da1b8152506119ae565b610f66611a35565b8015610f78576000805461ff00191690555b50565b60606066805461061990612ade565b600081815260ca602090815260408083205460679092528220546001600160a01b03161580159260609161105d57600085815260cb602052604090208054610fd190612ade565b80601f0160208091040260200160405190810160405280929190818152602001828054610ffd90612ade565b801561104a5780601f1061101f5761010080835404028352916020019161104a565b820191906000526020600020905b81548152906001019060200180831161102d57829003601f168201915b5050505050915061105a85610daa565b90505b9193509193565b336001600160a01b038316036110bc5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610711565b336000818152606a602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b611132338361158e565b61114e5760405162461bcd60e51b815260040161071190612c56565b61115a84848484611a94565b50505050565b8080158061117a5750600081815260c96020526040902054155b1561119b576040516387fe3aad60e01b815260048101829052602401610711565b600081815260c9602052604090205433906111b590610daa565b6001600160a01b0316146111dc57604051635612e54f60e11b815260040160405180910390fd5b6000828152610100602052604081206111f4906118d1565b6000848152610100602052604081209192509061121090611ac7565b90508061123057604051634816a76760e01b815260040160405180910390fd5b837fb3c3b87d0ea8237b590c2dbf7d3acf90e54a40cf0ef1e4c0d948736e1fabd8a983604051610ba191906128e4565b6000818152606760205260409020546060906001600160a01b031661129b576040516306caeb1360e41b815260048101839052602401610711565b600082815260cb6020526040902080546112b490612ade565b80601f01602080910402602001604051908101604052809291908181526020018280546112e090612ade565b801561132d5780601f106113025761010080835404028352916020019161132d565b820191906000526020600020905b81548152906001019060200180831161131057829003601f168201915b50505050509050919050565b818015806113535750600081815260c96020526040902054155b15611374576040516387fe3aad60e01b815260048101829052602401610711565b600081815260c96020526040902054339061138e90610daa565b6001600160a01b0316146113b557604051635612e54f60e11b815260040160405180910390fd5b81516000036113d757604051634816a76760e01b815260040160405180910390fd5b6000805b8351811015611455576114238482815181106113f9576113f9612aaf565b60200260200101516101006000888152602001908152602001600020611beb90919063ffffffff16565b91508161144357604051634816a76760e01b815260040160405180910390fd5b8061144d81612ac5565b9150506113db565b50837fb3c3b87d0ea8237b590c2dbf7d3acf90e54a40cf0ef1e4c0d948736e1fabd8a984604051610ba191906128e4565b606060cc80548060200260200160405190810160405280929190818152602001828054801561069257602002820191906000526020600020905b8154815260200190600101908083116114c0575050505050905090565b60006001600160e01b03198216635deabe7760e01b1480610604575061060482611dc9565b600081815260696020526040902080546001600160a01b0319166001600160a01b038416908117909155819061153782610daa565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b61158a828260405180602001604052806000815250611dee565b5050565b6000818152606760205260408120546001600160a01b03166116075760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610711565b600061161283610daa565b9050806001600160a01b0316846001600160a01b0316148061164d5750836001600160a01b03166116428461069c565b6001600160a01b0316145b8061167d57506001600160a01b038082166000908152606a602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b031661169882610daa565b6001600160a01b0316146117005760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610711565b6001600160a01b0382166117625760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610711565b61176d838383611e21565b611778600082611502565b6001600160a01b03831660009081526068602052604081208054600192906117a1908490612cf5565b90915550506001600160a01b03821660009081526068602052604081208054600192906117cf908490612a9c565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000815160000361184357506000610604565b600061184e83611ed9565b600081815260018601602052604090205490915060ff166118b6576000818152600185810160209081526040808420805460ff19168417905587546002890183529084208190559182018755868352909120016118ab8482612d08565b506001915050610604565b600090815260018401602052604090205460ff169050610604565b606081600001805480602002602001604051908101604052809291908181526020016000905b828210156119a357838290600052602060002001805461191690612ade565b80601f016020809104026020016040519081016040528092919081815260200182805461194290612ade565b801561198f5780601f106119645761010080835404028352916020019161198f565b820191906000526020600020905b81548152906001019060200180831161197257829003601f168201915b5050505050815260200190600101906118f7565b505050509050919050565b600054610100900460ff16806119c7575060005460ff16155b6119e35760405162461bcd60e51b815260040161071190612ca7565b600054610100900460ff16158015611a05576000805461ffff19166101011790555b611a0d611f09565b611a15611f09565b611a1f8383611f73565b8015610846576000805461ff0019169055505050565b600054610100900460ff1680611a4e575060005460ff16155b611a6a5760405162461bcd60e51b815260040161071190612ca7565b600054610100900460ff16158015611a8c576000805461ffff19166101011790555b610f66611ffa565b611a9f848484611685565b611aab84848484612069565b61115a5760405162461bcd60e51b815260040161071190612dc8565b805460009015611bde576000805b8354811015611bc957611b8e846000018281548110611af657611af6612aaf565b906000526020600020018054611b0b90612ade565b80601f0160208091040260200160405190810160405280929190818152602001828054611b3790612ade565b8015611b845780601f10611b5957610100808354040283529160200191611b84565b820191906000526020600020905b815481529060010190602001808311611b6757829003601f168201915b5050505050611ed9565b60008181526002860160209081526040808320839055600188019091529020805460ff19169055915080611bc181612ac5565b915050611ad5565b50611bd58360006124bd565b50600192915050565b506000919050565b919050565b60008151600003611bfe57506000610604565b6000611c0983611ed9565b600081815260018601602052604090205490915060ff1615611dad5760008181526002850160205260408120548554909190611c4790600190612cf5565b9050818114611d4c576000866000018281548110611c6757611c67612aaf565b906000526020600020018054611c7c90612ade565b80601f0160208091040260200160405190810160405280929190818152602001828054611ca890612ade565b8015611cf55780601f10611cca57610100808354040283529160200191611cf5565b820191906000526020600020905b815481529060010190602001808311611cd857829003601f168201915b5050505050905080876000018481548110611d1257611d12612aaf565b906000526020600020019081611d289190612d08565b5082876002016000611d3984611ed9565b8152602081019190915260400160002055505b8554869080611d5d57611d5d612e1a565b600190038181906000526020600020016000611d7991906124db565b90555050600090815260028401602090815260408083208390556001808701909252909120805460ff191690559050610604565b600090815260018401602052604090205460ff16159050610604565b60006001600160e01b031982166345f8f68160e11b148061060457506106048261216a565b611df8838361218f565b611e056000848484612069565b6108465760405162461bcd60e51b815260040161071190612dc8565b6001600160a01b038316611e7c57611e7781609980546000838152609a60205260408120829055600182018355919091527f72a152ddfb8e864297c917af52ea6c1c68aead0fee1a62673fcc7e0c94979d000155565b611e9f565b816001600160a01b0316836001600160a01b031614611e9f57611e9f83826122dd565b6001600160a01b038216611eb6576108468161237a565b826001600160a01b0316826001600160a01b031614610846576108468282612429565b600081604051602001611eec9190612e30565b604051602081830303815290604052805190602001209050919050565b600054610100900460ff1680611f22575060005460ff16155b611f3e5760405162461bcd60e51b815260040161071190612ca7565b600054610100900460ff16158015610f66576000805461ffff19166101011790558015610f78576000805461ff001916905550565b600054610100900460ff1680611f8c575060005460ff16155b611fa85760405162461bcd60e51b815260040161071190612ca7565b600054610100900460ff16158015611fca576000805461ffff19166101011790555b6065611fd68482612d08565b506066611fe38382612d08565b508015610846576000805461ff0019169055505050565b600054610100900460ff1680612013575060005460ff16155b61202f5760405162461bcd60e51b815260040161071190612ca7565b600054610100900460ff16158015612051576000805461ffff19166101011790555b612059611f09565b612061611f09565b610f66611f09565b60006001600160a01b0384163b1561215f57604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906120ad903390899088908890600401612e4c565b6020604051808303816000875af19250505080156120e8575060408051601f3d908101601f191682019092526120e591810190612e89565b60015b612145573d808015612116576040519150601f19603f3d011682016040523d82523d6000602084013e61211b565b606091505b50805160000361213d5760405162461bcd60e51b815260040161071190612dc8565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061167d565b506001949350505050565b60006001600160e01b0319821663780e9d6360e01b148061060457506106048261246d565b6001600160a01b0382166121e55760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610711565b6000818152606760205260409020546001600160a01b03161561224a5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610711565b61225660008383611e21565b6001600160a01b038216600090815260686020526040812080546001929061227f908490612a9c565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b600060016122ea84610e3c565b6122f49190612cf5565b600083815260986020526040902054909150808214612347576001600160a01b03841660009081526097602090815260408083208584528252808320548484528184208190558352609890915290208190555b5060009182526098602090815260408084208490556001600160a01b039094168352609781528383209183525290812055565b60995460009061238c90600190612cf5565b6000838152609a6020526040812054609980549394509092849081106123b4576123b4612aaf565b9060005260206000200154905080609983815481106123d5576123d5612aaf565b6000918252602080832090910192909255828152609a9091526040808220849055858252812055609980548061240d5761240d612e1a565b6001900381819060005260206000200160009055905550505050565b600061243483610e3c565b6001600160a01b039093166000908152609760209081526040808320868452825280832085905593825260989052919091209190915550565b60006001600160e01b031982166380ac58cd60e01b148061249e57506001600160e01b03198216635b5e139f60e01b145b8061060457506301ffc9a760e01b6001600160e01b0319831614610604565b5080546000825590600052602060002090810190610f789190612515565b5080546124e790612ade565b6000825580601f106124f7575050565b601f016020900490600052602060002090810190610f789190612536565b8082111561253257600061252982826124db565b50600101612515565b5090565b5b808211156125325760008155600101612537565b6000806040838503121561255e57600080fd5b50508035926020909101359150565b6020808252825182820181905260009190848201906040850190845b818110156125a557835183529284019291840191600101612589565b50909695505050505050565b6001600160e01b031981168114610f7857600080fd5b6000602082840312156125d957600080fd5b81356125e4816125b1565b9392505050565b60005b838110156126065781810151838201526020016125ee565b50506000910152565b600081518084526126278160208601602086016125eb565b601f01601f19169290920160200192915050565b6020815260006125e4602083018461260f565b60006020828403121561266057600080fd5b5035919050565b80356001600160a01b0381168114611be657600080fd5b6000806040838503121561269157600080fd5b61269a83612667565b946020939093013593505050565b6000806000604084860312156126bd57600080fd5b83359250602084013567ffffffffffffffff808211156126dc57600080fd5b818601915086601f8301126126f057600080fd5b8135818111156126ff57600080fd5b87602082850101111561271157600080fd5b6020830194508093505050509250925092565b60008060006060848603121561273957600080fd5b61274284612667565b925061275060208501612667565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561279f5761279f612760565b604052919050565b600067ffffffffffffffff8311156127c1576127c1612760565b6127d4601f8401601f1916602001612776565b90508281528383830111156127e857600080fd5b828260208301376000602084830101529392505050565b600080604080848603121561281357600080fd5b8335925060208085013567ffffffffffffffff8082111561283357600080fd5b818701915087601f83011261284757600080fd5b81358181111561285957612859612760565b8060051b612868858201612776565b918252838101850191858101908b84111561288257600080fd5b86860192505b838310156128d2578235858111156128a05760008081fd5b8601603f81018d136128b25760008081fd5b6128c28d898301358b84016127a7565b8352509186019190860190612888565b80985050505050505050509250929050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561293957603f1988860301845261292785835161260f565b9450928501929085019060010161290b565b5092979650505050505050565b60006020828403121561295857600080fd5b6125e482612667565b8415158152836020820152608060408201526000612982608083018561260f565b905060018060a01b038316606083015295945050505050565b600080604083850312156129ae57600080fd5b6129b783612667565b9150602083013580151581146129cc57600080fd5b809150509250929050565b600080600080608085870312156129ed57600080fd5b6129f685612667565b9350612a0460208601612667565b925060408501359150606085013567ffffffffffffffff811115612a2757600080fd5b8501601f81018713612a3857600080fd5b612a47878235602084016127a7565b91505092959194509250565b60008060408385031215612a6657600080fd5b612a6f83612667565b9150612a7d60208401612667565b90509250929050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561060457610604612a86565b634e487b7160e01b600052603260045260246000fd5b600060018201612ad757612ad7612a86565b5060010190565b600181811c90821680612af257607f821691505b602082108103612b1257634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561084657600081815260208120601f850160051c81016020861015612b3f5750805b601f850160051c820191505b81811015612b5e57828155600101612b4b565b505050505050565b67ffffffffffffffff831115612b7e57612b7e612760565b612b9283612b8c8354612ade565b83612b18565b6000601f841160018114612bc65760008515612bae5750838201355b600019600387901b1c1916600186901b178355612c20565b600083815260209020601f19861690835b82811015612bf75786850135825560209485019460019092019101612bd7565b5086821015612c145760001960f88860031b161c19848701351681555b505060018560011b0183555b5050505050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b8181038181111561060457610604612a86565b815167ffffffffffffffff811115612d2257612d22612760565b612d3681612d308454612ade565b84612b18565b602080601f831160018114612d6b5760008415612d535750858301515b600019600386901b1c1916600185901b178555612b5e565b600085815260208120601f198616915b82811015612d9a57888601518255948401946001909101908401612d7b565b5085821015612db85787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b634e487b7160e01b600052603160045260246000fd5b60008251612e428184602087016125eb565b9190910192915050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090612e7f9083018461260f565b9695505050505050565b600060208284031215612e9b57600080fd5b81516125e4816125b156fea2646970667358221220582f5aaee02e71ee9e011498a6d63f11d920c6e38d759e772667f9ab8fa0abdb64736f6c63430008110033";

type OrgIdConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OrgIdConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OrgId__factory extends ContractFactory {
  constructor(...args: OrgIdConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<OrgId> {
    return super.deploy(overrides || {}) as Promise<OrgId>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): OrgId {
    return super.attach(address) as OrgId;
  }
  override connect(signer: Signer): OrgId__factory {
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
