/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { MixverseSpace, MixverseSpaceInterface } from "../MixverseSpace";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pricePerToken",
        type: "uint256",
      },
    ],
    name: "ItemCanceledEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pricePerToken",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "ItemListedEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pricePerToken",
        type: "uint256",
      },
    ],
    name: "ItemPurchasedEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pricePerToken",
        type: "uint256",
      },
    ],
    name: "ItemSoldEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
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
        name: "itemId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_cid",
        type: "string",
      },
    ],
    name: "create",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "getBaseURI",
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
    name: "getUserItems",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "collection",
            type: "address",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "totalAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "remainAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "enum MixverseSpace.ItemStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct MixverseSpace.ListingItem[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
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
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "list",
    outputs: [],
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
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "renounceOwnership",
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
        internalType: "string",
        name: "newURI",
        type: "string",
      },
    ],
    name: "updateBaseURI",
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
  "0x60808060405234620002a757600090600b546200001c81620002ac565b808352926001918083169081156200028957506001146200024d575b919250601f916001600160401b0390601f1990859003840181168501828111868210176200023757604052845191821162000237576200007a600254620002ac565b848111620001f7575b506020908483116001146200019257508192939460009262000186575b5050600019600383901b1c191690821b176002555b60048054336001600160a01b0319821681179092556001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a360055562000108600b54620002ac565b81811162000145575b7f68747470733a2f2f697066732e696f2f697066732f000000000000000000002a600b556040516128709081620003038239f35b600b6000526200017e910160051c7f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db990810190620002e9565b388062000111565b015190503880620000a0565b8216906002600052806000209160005b818110620001e05750958385969710620001c6575b505050811b01600255620000b5565b015160001960f88460031b161c19169055388080620001b7565b8783015184559285019260209283019201620001a2565b6200022690600260005260206000208680860160051c820192602087106200022d575b0160051c0190620002e9565b3862000083565b925081926200021a565b634e487b7160e01b600052604160045260246000fd5b50600b600052602080600020936000905b80821062000273575083809550010162000038565b855485830184015294830194908201906200025e565b602092508495915060ff191682850152151560051b83010162000038565b600080fd5b90600182811c92168015620002de575b6020831014620002c857565b634e487b7160e01b600052602260045260246000fd5b91607f1691620002bc565b818110620002f5575050565b60008155600101620002e956fe6040608081526004908136101561001557600080fd5b60009160e08335811c908162efa8951461181b578162fdd58e146117ea5781630118fa49146113b857816301ffc9a71461132d5781630e89341c1461130b57816319aeb490146111265781632eb2c2d614610d285781634e1273f414610b8b5781634f558e7914610b615781636502096a14610872578163714c53981461083c57848263715018a6146107f1575081638da5cb5b146107c9578163931688cb14610676578163a22cb465146105bc578163bc197c8114610596578163bd85b0391461056e578163d6febde81461026c57508063e985e9c514610213578063f23a6e61146101ea578063f242432a146101c95763f2fde38b1461011657600080fd5b346101c55760203660031901126101c55761012f611a77565b90610138611d1a565b6001600160a01b03918216928315610173575080546001600160a01b0319811684179091551660008051602061281b8339815191528380a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b83346101e7576101e46101db36611cc5565b93929092611ea9565b80f35b80fd5b50503461020f576020906101fd36611cc5565b50505050505163f23a6e6160e01b8152f35b5080fd5b50503461020f578060031936011261020f5761022d611a77565b6001600160a01b036024358181169290839003610268579360ff92849260209616825260018652828220908252855220541690519015158152f35b8480fd5b91905061027836611a5c565b919093610283612522565b848652602091600a835281872091805161029c81611a8d565b8354815260018401549685820197885260018060a01b0390816002870154169784840198895282600388015416936060810194855286880154966080820197885260058901549160a0810192835260ff600760068c01549b60c084019c8d520154169061030c8682019283612500565b51151580610546575b61031f9150612578565b61033161032c8d51612682565b612479565b61033c8315156124b7565b828251106104f857885190838202918083048514901517156104e5578134106104ab5750908d8080809e9d9c9b9a9998979695948190888a51168282156104a2575bf1156104985791818960058f958f8f6103d87fbc1e0e4e50bc548032162fc5cd63a6c193fe00aa232981ea45f2d5d0c9a2979c988d946103d2600a9451838851916103c883611abf565b8883523330611fc2565b516125ba565b9489835252200155898c5191868d5116878951168b51918d51948c519687528601528a850152336060850152608084015260a083015260c0820152a2898952600a86526005838a20015415610431575b88600160055580f35b8060a0986007857fe81b3c7688efbf6150d5e8ae9fa2b9052b63884e41b20b4851de551a1a82098e9c2001600260ff19825416179055519751169151169251935194825196875286015284015260608301526080820152a238818180808080808080610428565b85513d8d823e3d90fd5b506108fc61037e565b875162461bcd60e51b81529081018b90526014602482015273496e73756666696369656e742062616c616e636560601b6044820152606490fd5b634e487b7160e01b8f526011905260248efd5b865162461bcd60e51b81529081018a9052602260248201527f5468657265206973206e6f7420656e6f75676820746f6b656e7320746f2073656044820152611b1b60f21b6064820152608490fd5b5051600381101561055b5761031f9015610315565b634e487b7160e01b8f526021825260248ffd5b5050346101c55760203660031901126101c55760209282913581526003845220549051908152f35b5050503461020f576020906105aa36611c10565b50505050505163bc197c8160e01b8152f35b505090346101c557806003193601126101c5576105d7611a77565b9060243591821515809303610268576001600160a01b0316923384146106345750338452600160205280842083855260205280842060ff1981541660ff84161790555190815260008051602061279b83398151915260203392a380f35b6020608492519162461bcd60e51b8352820152602960248201526000805160206127bb833981519152604482015268103337b91039b2b63360b91b6064820152fd5b8285346101e75760208060031936011261020f576001600160401b039083358281116107c5576106a99036908601611afd565b936106b2611d1a565b84519283116107b257506106c7600b5461243f565b601f811161076e575b5080601f831160011461070b57508293829392610700575b50508160011b916000199060031b1c191617600b5580f35b0151905083806106e8565b90601f19831694600b85528285209285905b87821061075657505083600195961061073d575b505050811b01600b5580f35b015160001960f88460031b161c19169055838080610731565b8060018596829496860151815501950193019061071d565b600b8452818420601f840160051c8101918385106107a8575b601f0160051c01905b81811061079d57506106d0565b848155600101610790565b9091508190610787565b634e487b7160e01b845260419052602483fd5b8380fd5b5050346101c557826003193601126101c5575490516001600160a01b03909116815260209150f35b80843461083957816003193601126108395761080b611d1a565b80546001600160a01b031981169091556001600160a01b031660008051602061281b8339815191528280a380f35b50fd5b5050503461020f578160031936011261020f5761086e9061085b6125c7565b9051918291602083526020830190611b76565b0390f35b84929150346101c557826003193601126101c55760079392939182548593865b828110610ae4575086906108a586611b9b565b956108b288519788611ada565b8087526108c1601f1991611b9b565b01885b818110610a97575050875b838110610997575050505083519485946020908187019282885286518094528282890197019581925b858410610905578989038af35b919395979087819496989a505180518352878101518884015260018060a01b03808583015116858501526060908183015116908401526080808201519084015260a0808201519084015260c0808201519084015201516003811015610984576101008288928660019501520199019401918998979593919694966108f8565b634e487b7160e01b855260218952602485fd5b60019894969798808201808311610a845786526020600a81528a60018060a01b036003338282858d20015416146109e1575b50505050506109d790611df7565b97969593976108cf565b8260ff928892610a45958d9b999b20928051976109fd89611a8d565b84548952898501549089015282600285015416908801528201541660608601528c8101546080860152600581015460a0860152600681015460c0860152015416898301612500565b610a4f838b611e1c565b52610a5a828a611e1c565b508101809111610a7157916109d78a8a81806109c9565b634e487b7160e01b855260118752602485fd5b634e487b7160e01b875260118952602487fd5b602090899a96989951610aa981611a8d565b878152828881830152888d8301528860608301528860808301528860a08301528860c0830152888a830152828c0101520198979694986108c4565b60019793959697808201808311610b4e578552600a602052888520600301546001600160a01b03163314610b27575b50610b1d90611df7565b9695949296610892565b87919701809111610b3b5795610b1d610b13565b634e487b7160e01b845260118652602484fd5b634e487b7160e01b865260118852602486fd5b5050346101c55760203660031901126101c557602092829135815260038452205415159051908152f35b5050346101c557816003193601126101c55780356001600160401b038082116102685736602383011215610268578183013590610bc782611b9b565b92610bd486519485611ada565b82845260209260248486019160051b83010191368311610d2457602401905b828210610d0157505050602435908111610cfd57610c149036908501611bb2565b928251845103610caa5750815194610c2b86611b9b565b95610c3886519788611ada565b808752610c47601f1991611b9b565b0136838801375b8251811015610c9857610c9390610c836001600160a01b03610c708387611e1c565b5116610c7c8388611e1c565b5190611d72565b610c8d8289611e1c565b52611df7565b610c4e565b84518281528061086e81850189611c91565b60849185519162461bcd60e51b8352820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b6064820152fd5b8580fd5b81356001600160a01b0381168103610d20578152908401908401610bf3565b8980fd5b8880fd5b8285853461020f57610d3936611c10565b909692959390926001600160a01b0391821692913384148015611107575b610d6090611e46565b82518951036110b3578716938415610d788115611efc565b8415611060575b610fb6575b855b8351811015610e085780610d9d610e039286611e1c565b51610da8828d611e1c565b5190808a526020908a82528b8b20898c528252828c8c8b8282205492610dd085851015611f56565b858352828752822091528452038c8c20558a528981528a8a2090898b5252610dfc8a8a20918254611fb5565b9055611df7565b610d86565b509293909691859892828689518a81527f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb610e458c830187611c91565b91808303602082015280610e5a33948b611c91565b0390a43b610e66578580f35b8795610eb995610ec8610ea6956020978b51998a988997889663bc197c8160e01b9e8f89523390890152602488015260a0604488015260a4870190611c91565b6003199384878303016064880152611c91565b91848303016084850152611b76565b03925af1859181610f86575b50610f575750506001610ee5612329565b6308c379a014610f20575b610f035750505b81808281808080808580f35b5162461bcd60e51b815291508190610f1c9082016123b5565b0390fd5b610f28612347565b80610f335750610ef0565b9050610f1c91602094505193849362461bcd60e51b85528401526024830190611b76565b6001600160e01b03191603610f6d575050610ef7565b5162461bcd60e51b815291508190610f1c9082016122e0565b610fa891925060203d8111610faf575b610fa08183611ada565b8101906122c0565b9086610ed4565b503d610f96565b9691928596959491945b845181101561105157610fd38186611e1c565b51610fde828c611e1c565b5190808a52600360208181528a8c20549284841061100f578c5252888a20919003905561100a90611df7565b610fc0565b8b5162461bcd60e51b8152808c01839052602860248201526000805160206127fb833981519152604482015267616c537570706c7960c01b6064820152608490fd5b50929196959495939093610d84565b98949297939190865b89518110156110a657806110806110a19289611e1c565b5161108b828d611e1c565b518a526003602052610dfc8b8b20918254611fb5565b611069565b5090919397929498610d7f565b865162461bcd60e51b8152602081840152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b6064820152608490fd5b508386526001602090815287872033885290528686205460ff16610d57565b8285853461020f57606036600319011261020f57823560243560443561114a612522565b61115661032c84612682565b6111618215156124b7565b8161116c8433611d72565b106112c8576007949596600186540195869182825586519061118d82611a8d565b8382528960208301888152898401308152606085019033825260808601928a84528c60a08801958c875260c08901978c895289019a818c528152600a6020522096518755516001870155600286019060018060a01b03809151169160018060a01b031992838254161790556003870192511690825416179055518c84015551600583015551600682015501905160038110156112b557917f87ed4be4e4ee79014a64d9fc4a9d0a961f4f5f16189cd3d94648ed66ca50116b959493916112aa9360ff80198354169116179055611273855161126781611abf565b89815283863033611ea9565b61127c8461269f565b918551958695865230602087015233908601526060850152608084015260c060a084015260c0830190611b76565b0390a2600160055580f35b634e487b7160e01b885260218952602488fd5b835162461bcd60e51b8152602081880152601d60248201527f496e73756666696369656e742062616c616e636520666f72206c6973740000006044820152606490fd5b505091346101e75760203660031901126101e7575061085b61086e923561269f565b5050346101c55760203660031901126101c557359063ffffffff60e01b82168092036101c55760209250636cdb3d1360e11b82149182156113a7575b8215611379575b50519015158152f35b909150630271189760e51b8114908115611396575b509038611370565b6301ffc9a760e01b1490503861138e565b6303a24d0760e21b81149250611369565b505090346101c557806003193601126101c5576001600160401b039180359190602480358581116117e6576113f09036908401611afd565b6113f8611d1a565b6001948560065401918260065582895260209760088952868a203360018060a01b031982541617905560098952868a209180519182116117d457819061143e845461243f565b601f8111611784575b508a90601f8311600114611724578c92611719575b5050600019600383901b1c191690881b1790555b84519161147c83611abf565b88835233156116cd5788929181886114948b9461240a565b61149d8461240a565b87835b611679575b5050505080855284835287852033865283528785206114c5838254611fb5565b9055875181815282848201528533916000805160206127db8339815191528b3392a4333b611572575b505050505030331461153257505033845281835280842030855283528084208260ff198254161790555190815260008051602061279b83398151915230923392a380f35b60299085608494519362461bcd60e51b85528401528201526000805160206127bb833981519152604482015268103337b91039b2b63360b91b6064820152fd5b6115ac8851948593849363f23a6e6160e01b98898652338c8701528a8601526044850152606484015260a0608484015260a4830190611b76565b03818b335af188918161165a575b50611631575050836115ca612329565b6308c379a0146115fe575b6115e4575b85388681806114ee565b50905162461bcd60e51b8152908190610f1c9082016123b5565b611606612347565b8061161157506115d5565b92945050610f1c925194859462461bcd60e51b8652850152830190611b76565b6001600160e01b031916146115da5750905162461bcd60e51b8152908190610f1c9082016122e0565b611672919250883d8a11610faf57610fa08183611ada565b90386115ba565b90919293949583518210156116c457906116b79160036116998386611e1c565b51916116a58488611e1c565b518c5252610dfc8d8b20918254611fb5565b908392918d9695946114a0565b959493926114a5565b855162461bcd60e51b81528086018990526021818601527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b6064820152608490fd5b01519050388061145c565b848d528b8d208b94509190601f1984168e8e5b82821061176d5750508411611754575b505050811b019055611470565b015160001960f88460031b161c19169055388080611747565b8385015186558e979095019493840193018e611737565b909150838c528a8c20601f840160051c8101918c85106117ca575b84939291601f8d920160051c01915b8281106117bc575050611447565b8e81558594508c91016117ae565b909150819061179f565b634e487b7160e01b8b5260418752858bfd5b8680fd5b5050503461020f578060031936011261020f5760209061181461180b611a77565b60243590611d72565b9051908152f35b90508391346101c55761182d36611a5c565b611838939193612522565b838552602091600a835286862090875161185181611a8d565b82548152600183015485820190815260018060a01b039081600286015416978b840198895282600387015416936060810194855281870154956080820196875260058801549160a081019283526118bf60ff600760068c01549b60c085019c8d520154169282019283612500565b858751163303611a1b57511515806119f3575b6118dc9150612578565b6118e961032c8451612682565b6118f48815156124b7565b878151106119a45792828b82938e9f7f686a736c00161c1a5a9c35ddee0125551ffd0628a321eef9c060809c3826e9049e9f8d60c09f9e9d9c9b9a986119548e859c6103d2600a94518389519161194a83611abf565b8983523330611ea9565b91868452526005838320015561196b8c8b516125ba565b938152600a8d5220015551985116915116925193519582519788528701528501526060840152608083015260a0820152a2600160055580f35b8c5162461bcd60e51b81528083018a90526024808201527f5468657265206973206e6f7420656e6f75676820746f6b656e7320746f2063616044820152631b98d95b60e21b6064820152608490fd5b50516003811015611a08576118dc90156118d2565b634e487b7160e01b8d526021835260248dfd5b8e5162461bcd60e51b81528085018c9052601b60248201527a27b7363c9037bbb732b91031b0b71031b0b731b2b61037b93232b960291b6044820152606490fd5b6040906003190112611a72576004359060243590565b600080fd5b600435906001600160a01b0382168203611a7257565b61010081019081106001600160401b03821117611aa957604052565b634e487b7160e01b600052604160045260246000fd5b602081019081106001600160401b03821117611aa957604052565b601f909101601f19168101906001600160401b03821190821017611aa957604052565b81601f82011215611a72578035906001600160401b038211611aa95760405192611b31601f8401601f191660200185611ada565b82845260208383010111611a7257816000926020809301838601378301015290565b60005b838110611b665750506000910152565b8181015183820152602001611b56565b90602091611b8f81518092818552858086019101611b53565b601f01601f1916010190565b6001600160401b038111611aa95760051b60200190565b81601f82011215611a7257803591611bc983611b9b565b92611bd76040519485611ada565b808452602092838086019260051b820101928311611a72578301905b828210611c01575050505090565b81358152908301908301611bf3565b60a0600319820112611a72576001600160a01b03916004358381168103611a7257926024359081168103611a7257916001600160401b0391604435838111611a725782611c5f91600401611bb2565b92606435818111611a725783611c7791600401611bb2565b92608435918211611a7257611c8e91600401611afd565b90565b90815180825260208080930193019160005b828110611cb1575050505090565b835185529381019392810192600101611ca3565b60a0600319820112611a72576001600160a01b03916004358381168103611a7257926024359081168103611a7257916044359160643591608435906001600160401b038211611a7257611c8e91600401611afd565b6004546001600160a01b03163303611d2e57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b6001600160a01b0316908115611d9f57600052600060205260406000209060005260205260406000205490565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b6064820152608490fd5b6000198114611e065760010190565b634e487b7160e01b600052601160045260246000fd5b8051821015611e305760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b15611e4d57565b60405162461bcd60e51b815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201526d195c881bdc88185c1c1c9bdd995960921b6064820152608490fd5b611ed494939291906001600160a01b0381163381148015611ed6575b611ecf9150611e46565b611fc2565b565b506000526001602052604060002033600052602052611ecf60ff60406000205416611ec5565b15611f0357565b60405162461bcd60e51b815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b15611f5d57565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201526939103a3930b739b332b960b11b6064820152608490fd5b91908201809211611e0657565b90936001600160a01b038086169491938515939091611fe18515611efc565b611fea8361240a565b90611ff48561240a565b9216948515612263575b6121a9575b50506000938185526020958587526040978887208688528852848988205461202d82821015611f56565b858952888a528a8920888a528a520389882055838752868852888720828852885288872061205c868254611fb5565b905581868a51868152878b8201526000805160206127db8339815191528c3392a43b61208d575b5050505050505050565b6120cf938688948a519687958694859363f23a6e6160e01b9b8c865233600487015260248601526044850152606484015260a0608484015260a4830190611b76565b03925af183918161218a575b5061215a5750506001916120ed612329565b6308c379a014612124575b505061210d57505b3880808080808080612083565b5162461bcd60e51b815280610f1c600482016123b5565b61212c612347565b918261213857506120f8565b84610f1c91505192839262461bcd60e51b845260048401526024830190611b76565b6001600160e01b03191603915061217390505750612100565b5162461bcd60e51b815280610f1c600482016122e0565b6121a2919250853d8711610faf57610fa08183611ada565b90386120db565b95926000989592979491985b8751811015612252576121c88189611e1c565b516121d3828c611e1c565b518160005260039160209280845260409384600020549284841061220f579061220a96959493929160005252039060002055611df7565b6121b5565b855162461bcd60e51b815260048101839052602860248201526000805160206127fb833981519152604482015267616c537570706c7960c01b6064820152608490fd5b509295509295909396503880612003565b97936000999591979396929996875b89518110156122b057806122896122ab928e611e1c565b51612294828d611e1c565b518b526003602052610dfc60408c20918254611fb5565b612272565b5093979195999296509397611ffe565b90816020910312611a7257516001600160e01b031981168103611a725790565b60809060208152602860208201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b60608201520190565b60009060033d1161233657565b905060046000803e60005160e01c90565b600060443d10611c8e57604051600319913d83016004833e81516001600160401b03918282113d6024840111176123a4578184019485519384116123ac573d850101602084870101116123a45750611c8e92910160200190611ada565b949350505050565b50949350505050565b60809060208152603460208201527f455243313135353a207472616e7366657220746f206e6f6e2d455243313135356040820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60608201520190565b60408051919082016001600160401b03811183821017611aa95760405260018252602082016020368237825115611e30575290565b90600182811c9216801561246f575b602083101461245957565b634e487b7160e01b600052602260045260246000fd5b91607f169161244e565b1561248057565b60405162461bcd60e51b815260206004820152600f60248201526e151bdad95b881b9bdd08199bdd5b99608a1b6044820152606490fd5b156124be57565b60405162461bcd60e51b815260206004820152601a602482015279125b9d985b1a5908185c99dd5b595b9d081bd988185b5bdd5b9d60321b6044820152606490fd5b600382101561250c5752565b634e487b7160e01b600052602160045260246000fd5b600260055414612533576002600555565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b1561257f57565b60405162461bcd60e51b81526020600482015260136024820152724974656d207761736e2774206c697374696e6760681b6044820152606490fd5b91908203918211611e0657565b60405190600082600b54916125db8361243f565b8083526001938085169081156126615750600114612601575b50611ed492500383611ada565b600b60009081527f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db994602093509091905b818310612649575050611ed49350820101386125f4565b85548884018501529485019487945091830191612632565b9050611ed494506020925060ff191682840152151560051b820101386125f4565b6000908152600860205260409020546001600160a01b0316151590565b6126ab61032c82612682565b600090815260209060098252604081206126c36125c7565b91604051908083546126d48161243f565b918285528785019560019283811690816000146127785750600114612741575b50505050918161270e611c8e959361273597950382611ada565b60405195836127268895518092888089019101611b53565b84019151809386840190611b53565b01038084520182611ada565b90809450528683205b82841061276557505050810184018161270e816127356126f4565b805485850189015292870192810161274a565b60ff1916885250505050151560051b8201850190508161270e816127356126f456fe17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31455243313135353a2073657474696e6720617070726f76616c20737461747573c3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62455243313135353a206275726e20616d6f756e74206578636565647320746f748be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0a26469706673582212206e5e0c8fc9d2c1b4fffc33c1668a2e3845ce7cac83dbf1e2a810c2853e9239b364736f6c63430008110033";

type MixverseSpaceConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MixverseSpaceConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MixverseSpace__factory extends ContractFactory {
  constructor(...args: MixverseSpaceConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MixverseSpace> {
    return super.deploy(overrides || {}) as Promise<MixverseSpace>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MixverseSpace {
    return super.attach(address) as MixverseSpace;
  }
  override connect(signer: Signer): MixverseSpace__factory {
    return super.connect(signer) as MixverseSpace__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MixverseSpaceInterface {
    return new utils.Interface(_abi) as MixverseSpaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MixverseSpace {
    return new Contract(address, _abi, signerOrProvider) as MixverseSpace;
  }
}
