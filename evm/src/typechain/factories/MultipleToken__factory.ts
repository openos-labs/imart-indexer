/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { MultipleToken, MultipleTokenInterface } from "../MultipleToken";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
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
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
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
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
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
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
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
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "exists",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
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
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
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
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_uri",
        type: "string",
      },
    ],
    name: "safeMint",
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
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
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
        internalType: "address",
        name: "_marketplace",
        type: "address",
      },
    ],
    name: "setMarketplace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "supply",
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
        name: "_id",
        type: "uint256",
      },
    ],
    name: "supply",
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
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "uri",
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
] as const;

const _bytecode =
  "0x6080806040523461001657611d11908161001c8239f35b600080fdfe60406080815260048036101561001457600080fd5b600091823560e01c8062fdd58e1461156157806301ffc9a7146114d6578063047fc9aa146114b65780630e89341c146113865780632eb2c2d614610fd457806335403023146109cf5780634e1273f414610e375780634f558e7914610e0d57806373ad6c2d14610dbd5780639065714714610ad4578063a22cb46514610a1c578063bc197c81146109f7578063bd85b039146109cf578063cd279c7c14610552578063e985e9c5146104f9578063f23a6e61146104d4578063f242432a1461018d5763f2fde38b146100e557600080fd5b34610189576020366003190112610189576100fe611591565b6101318054909390916001600160a01b039061011d8285163314611b76565b169283156101375750506001600160a01b03191617905580f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b509190346104d05761019e366117a5565b9196936001600160a01b03908116919033831480156104b1575b6101c1906118ce565b84168015986101d08a15611931565b6101d981611b41565b6101e284611b41565b9a8515610457575b6103a4575b5088995080899697989952602096606588528887208588528852838988205461021a8282101561198b565b83895260658a528a8920878a528a52038988205581875260658852888720838852885288872061024b8582546119ea565b905582858a51848152868b820152600080516020611c9c8339815191528c3392a43b610275578580f35b889587946102b68a519788968795869463f23a6e6160e01b9c8d8752339087015260248601526044850152606484015260a0608484015260a48301906115ac565b03925af1869181610375575b506103445750506001906102d4611a60565b6308c379a014610311575b506102f45750505b3880808381808080808580f35b5162461bcd60e51b81529150819061030d908201611aec565b0390fd5b610319611a7e565b8061032457506102df565b61030d8591855193849362461bcd60e51b855284015260248301906115ac565b6001600160e01b03191603905061035c5750506102e7565b5162461bcd60e51b81529150819061030d908201611a17565b610396919250843d861161039d575b61038e81836115ec565b8101906119f7565b90386102c2565b503d610384565b9492909897959391885b8651811015610440578b6103cd826103c6818b6118a4565b51926118a4565b51818c52609760208181528c8e205492938484106103fe578e52528a8c2091900390556103f99061187f565b6103ae565b508b6084918e519162461bcd60e51b835282015260286024820152600080516020611cbc833981519152604482015267616c537570706c7960c01b6064820152fd5b5097995089989597939592945090929091386101ef565b999694929098959391875b8c8b518210156104a157908b61047f826103c68161049c966118a4565b518b5260976020526104958c8c209182546119ea565b905561187f565b610462565b50509193959890929496996101ea565b5082885260666020908152868920338a5290528588205460ff166101b8565b5080fd5b8382346104d0576020906104e7366117a5565b50505050505163f23a6e6160e01b8152f35b8382346104d057806003193601126104d057610513611591565b6001600160a01b03602435818116929083900361054e579360ff92849260209616825260668652828220908252855220541690519015158152f35b8480fd5b50346101895760603660031901126101895761056c611591565b6001600160401b03916044358381116109cb5761058c903690860161169a565b9060019161012d938385540180955584885260209461012f86528389209660018060a01b0393848416988960018060a01b03198254161790556101308852858b20908051908382116109b8578c82916105e58554611c21565b8c601f8211610963575b50508b91601f841160011461090257926108f7575b5050600019600383901b1c191690881b1790555b845190878201908111828210176108e4578552898152871561089757818a88926106438c9695611b41565b94896024359661065288611b41565b85835b610832575b50505050838352606585528883208c8452855288832061067b8782546119ea565b90558b838a518681528888820152600080516020611c9c8339815191528c3392a43b61072c575b50505050505061012e5416948585146106eb5750838652606683528086208587528352808620805460ff19168317905551908152600080516020611c5c8339815191529190a380f35b83608492519162461bcd60e51b835282015260296024820152600080516020611c7c833981519152604482015268103337b91039b2b63360b91b6064820152fd5b610768908851958694859463f23a6e6160e01b998a8752339087015260248601526044850152606484015260a0608484015260a48301906115ac565b03818c8b5af1899181610813575b506107ed57505082610786611a60565b6308c379a0146107b8575b6107a1575b853885818a816106a2565b815162461bcd60e51b81528061030d818901611aec565b6107c0611a7e565b806107cb5750610791565b835162461bcd60e51b815280890187905290819061030d9060248301906115ac565b6001600160e01b0319161461079657815162461bcd60e51b81528061030d818901611a17565b61082b919250873d891161039d5761038e81836115ec565b9038610776565b91939597849a91939597999a5183101561088857829150609761085861087694866118a4565b519161086484886118a4565b518b52526104958d8a209182546119ea565b9183918f99989694938e989694610655565b979593819a999795935061065a565b845162461bcd60e51b8152808a01889052602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b6064820152608490fd5b634e487b7160e01b8b5260418a5260248bfd5b015190503880610604565b8581528c81208c9550929190601f198516908e5b82821061094c5750508411610933575b505050811b019055610618565b015160001960f88460031b161c19169055388080610926565b8385015186558e979095019493840193018e610916565b9193509185815220601f840160051c81018c85106109b1575b918f92859492601f8e92930160051c01915b82811061099d5750508c6105ef565b809294919395505501918e918b859461098e565b508061097c565b634e487b7160e01b8d5260418c5260248dfd5b8580fd5b5090346101895760203660031901126101895760209282913581526097845220549051908152f35b8382346104d057602090610a0a366116f0565b50505050505163bc197c8160e01b8152f35b5034610189578060031936011261018957610a35611591565b906024359182151580930361054e576001600160a01b031692338414610a925750338452606660205280842083855260205280842060ff1981541660ff841617905551908152600080516020611c5c83398151915260203392a380f35b6020608492519162461bcd60e51b835282015260296024820152600080516020611c7c833981519152604482015268103337b91039b2b63360b91b6064820152fd5b50903461018957606036600319011261018957610aef611591565b916001600160401b03906024358281116109cb57610b10903690850161169a565b506044358281116109cb57610b28903690850161169a565b5084549160ff8360081c161594858096610db0575b8015610d99575b15610d3f57600193868560ff198316178955610d2e575b5061013180546001600160a01b0319166001600160a01b03909216919091179055815160209485820183811183821017610d1b578452878252610bad60ff895460081c16610ba881611bc1565b611bc1565b8151928311610d0857508190610bc4606754611c21565b601f8111610cb7575b508590601f8311600114610c56578892610c4b575b5050600019600383901b1c191690831b176067555b845493610c0d60ff8660081c16610ba881611bc1565b610c15578480f35b7f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989361ff001916855551908152a1388080808480f35b015190503880610be2565b606789528689208694509190601f1984168a5b89828210610ca15750508411610c88575b505050811b01606755610bf7565b015160001960f88460031b161c19169055388080610c7a565b8385015186558997909501949384019301610c69565b90915060678852858820601f840160051c810191878510610cfe575b84939291601f88920160051c01915b828110610cf0575050610bcd565b8a8155859450879101610ce2565b9091508190610cd3565b634e487b7160e01b885260419052602487fd5b634e487b7160e01b895260418252602489fd5b61ffff191661010117875538610b5b565b825162461bcd60e51b8152602081870152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b158015610b445750600160ff851614610b44565b50600160ff851610610b3d565b8334610e0a576020366003190112610e0a57610dd7611591565b610131546001600160a01b0390610df19082163314611b76565b61012e80546001600160a01b0319169190921617905580f35b80fd5b50903461018957602036600319011261018957602092829135815260978452205415159051908152f35b50903461018957816003193601126101895780356001600160401b0380821161054e573660238301121561054e578183013590610e7382611625565b92610e80865194856115ec565b82845260209260248486019160051b83010191368311610fd057602401905b828210610fad575050506024359081116109cb57610ec0903690850161163c565b928251845103610f5a5750815194610ed786611625565b95610ee4865197886115ec565b808752610ef3601f1991611625565b0136838801375b8251811015610f4457610f3f90610f2f6001600160a01b03610f1c83876118a4565b5116610f2883886118a4565b51906117fa565b610f3982896118a4565b5261187f565b610efa565b845182815280610f5681850189611771565b0390f35b60849185519162461bcd60e51b8352820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b6064820152fd5b81356001600160a01b0381168103610fcc578152908401908401610e9f565b8980fd5b8880fd5b508290346104d057610fe5366116f0565b909692959390926001600160a01b0391821692913384148015611367575b61100c906118ce565b82518951036113135787169384156110248115611931565b84156112c0575b611216575b855b83518110156110ae57806110496110a992866118a4565b51611054828d6118a4565b5190808a5260656020918183528c8c208a8d528352838d8d8c828220549261107e8585101561198b565b858352868852822091528552038d8d20558b5281528a8a2090898b52526104958a8a209182546119ea565b611032565b509293909691859892828689518a81527f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb6110eb8c830187611771565b9180830360208201528061110033948b611771565b0390a43b61110c578580f35b879561115f9561116e61114c956020978b51998a988997889663bc197c8160e01b9e8f89523390890152602488015260a0604488015260a4870190611771565b6003199384878303016064880152611771565b918483030160848501526115ac565b03925af18591816111f6575b506111e0575050600161118b611a60565b6308c379a0146111a9575b6102f45750505b81808281808080808580f35b6111b1611a7e565b806111bc5750611196565b905061030d91602094505193849362461bcd60e51b855284015260248301906115ac565b6001600160e01b0319160361035c57505061119d565b61120f91925060203d811161039d5761038e81836115ec565b908661117a565b9691928596959491945b84518110156112b15761123381866118a4565b5161123e828c6118a4565b5190808a52609760208181528a8c20549284841061126f578c5252888a20919003905561126a9061187f565b611220565b8b5162461bcd60e51b8152808c0183905260286024820152600080516020611cbc833981519152604482015267616c537570706c7960c01b6064820152608490fd5b50929196959495939093611030565b98949297939190865b895181101561130657806112e061130192896118a4565b516112eb828d6118a4565b518a5260976020526104958b8b209182546119ea565b6112c9565b509091939792949861102b565b865162461bcd60e51b8152602081840152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b6064820152608490fd5b508386526066602090815287872033885290528686205460ff16611003565b503461018957602091826003193601126114b257803580855261012f8452828520549091906001600160a01b03161561147d5750835261013082528083208151938491818154906113d682611c21565b92838652600192888482169182600014611453575050600114611415575b8588610f5689611406848a03856115ec565b519282849384528301906115ac565b87945081939291528383205b82841061143b5750505082010181611406610f56386113f4565b8054848a018601528895508794909301928101611421565b60ff19168882015294151560051b870190940194508593506114069250610f5691503890506113f4565b825162461bcd60e51b8152908101849052600f60248201526e151bdad95b881b9bdd08199bdd5b99608a1b6044820152606490fd5b8380fd5b8382346104d057816003193601126104d05760209061012d549051908152f35b50903461018957602036600319011261018957359063ffffffff60e01b82168092036101895760209250630271189760e51b821491821561151b575b50519015158152f35b909150636cdb3d1360e11b8114908115611550575b811561153f575b509038611512565b6301ffc9a760e01b14905038611537565b6303a24d0760e21b81149150611530565b8382346104d057806003193601126104d05760209061158a611581611591565b602435906117fa565b9051908152f35b600435906001600160a01b03821682036115a757565b600080fd5b919082519283825260005b8481106115d8575050826000602080949584010152601f8019910116010190565b6020818301810151848301820152016115b7565b601f909101601f19168101906001600160401b0382119082101761160f57604052565b634e487b7160e01b600052604160045260246000fd5b6001600160401b03811161160f5760051b60200190565b81601f820112156115a75780359161165383611625565b9261166160405194856115ec565b808452602092838086019260051b8201019283116115a7578301905b82821061168b575050505090565b8135815290830190830161167d565b81601f820112156115a7578035906001600160401b03821161160f57604051926116ce601f8401601f1916602001856115ec565b828452602083830101116115a757816000926020809301838601378301015290565b60a06003198201126115a7576001600160a01b039160043583811681036115a7579260243590811681036115a757916001600160401b03916044358381116115a7578261173f9160040161163c565b926064358181116115a757836117579160040161163c565b926084359182116115a75761176e9160040161169a565b90565b90815180825260208080930193019160005b828110611791575050505090565b835185529381019392810192600101611783565b60a06003198201126115a7576001600160a01b039160043583811681036115a7579260243590811681036115a757916044359160643591608435906001600160401b0382116115a75761176e9160040161169a565b6001600160a01b031690811561182757600052606560205260406000209060005260205260406000205490565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b6064820152608490fd5b600019811461188e5760010190565b634e487b7160e01b600052601160045260246000fd5b80518210156118b85760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b156118d557565b60405162461bcd60e51b815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201526d195c881bdc88185c1c1c9bdd995960921b6064820152608490fd5b1561193857565b60405162461bcd60e51b815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b1561199257565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201526939103a3930b739b332b960b11b6064820152608490fd5b9190820180921161188e57565b908160209103126115a757516001600160e01b0319811681036115a75790565b60809060208152602860208201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b60608201520190565b60009060033d11611a6d57565b905060046000803e60005160e01c90565b600060443d1061176e57604051600319913d83016004833e81516001600160401b03918282113d602484011117611adb57818401948551938411611ae3573d85010160208487010111611adb575061176e929101602001906115ec565b949350505050565b50949350505050565b60809060208152603460208201527f455243313135353a207472616e7366657220746f206e6f6e2d455243313135356040820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60608201520190565b60408051919082016001600160401b0381118382101761160f57604052600182526020820160203682378251156118b8575290565b15611b7d57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b15611bc857565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b90600182811c92168015611c51575b6020831014611c3b57565b634e487b7160e01b600052602260045260246000fd5b91607f1691611c3056fe17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31455243313135353a2073657474696e6720617070726f76616c20737461747573c3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62455243313135353a206275726e20616d6f756e74206578636565647320746f74a2646970667358221220a3e07a3513bb6f48ab429de667318ea70da531c6b9bba1cf9ca9004e3769d74b64736f6c63430008110033";

type MultipleTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MultipleTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MultipleToken__factory extends ContractFactory {
  constructor(...args: MultipleTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MultipleToken> {
    return super.deploy(overrides || {}) as Promise<MultipleToken>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MultipleToken {
    return super.attach(address) as MultipleToken;
  }
  override connect(signer: Signer): MultipleToken__factory {
    return super.connect(signer) as MultipleToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultipleTokenInterface {
    return new utils.Interface(_abi) as MultipleTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MultipleToken {
    return new Contract(address, _abi, signerOrProvider) as MultipleToken;
  }
}
