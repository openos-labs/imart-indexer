/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { MixverseSpace, MixverseSpaceInterface } from "../MixverseSpace";

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
        name: "owner",
        type: "address",
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
  "0x6080806040523461001657612b18908161001c8239f35b600080fdfe60406080815260048036101561001457600080fd5b60009160e08335811c908162efa89514611a86578162fdd58e14611a565781630118fa491461162f57816301ffc9a7146115a35781630e89341c1461158157816319aeb4901461139a5781632eb2c2d614610f9b5781634e1273f414610dfd5781634f558e7914610dd25781636502096a14610ae3578163714c539814610aae578163931688cb1461095b578163a22cb465146108a2578163bc197c811461087d578163bd85b03914610854578163c4d66de814610561578163d6febde81461025357508063e985e9c5146101fa578063f23a6e61146101d1578063f242432a146101b05763f2fde38b1461010857600080fd5b346101ac5760203660031901126101ac57610121611ce3565b6101658054909390916001600160a01b03906101408285163314612656565b1692831561015a5750506001600160a01b03191617905580f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b83346101ce576101cb6101c236611f31565b939290926120bd565b80f35b80fd5b8382346101f6576020906101e436611f31565b50505050505163f23a6e6160e01b8152f35b5080fd5b8382346101f657806003193601126101f657610214611ce3565b6001600160a01b03602435818116929083900361024f579360ff92849260209616825260ca8652828220908252855220541690519015158152f35b8480fd5b91905061025f36611cc8565b91909361026a6127fb565b848652610163936020928584528088209281519261028784611cf9565b8454845260018501549786850198895260018060a01b03918260028801541698858701998a52878460038201541695606089019687528c8183015499608081019a8b5260ff6007600660058701549660a0850197885201549d60c084019e8f52015416906102f887820192836127d9565b5115159081610535575b5061031e9161031361031992612852565b51612948565b612752565b610329831515612790565b828251106104e757895190838202918083048514901517156104d45781341061049a5750908e80809e9d9c9b9a99989796959493818091898b5116828215610491575bf11561048757918a8a8f94938f8f808e9260058e6103ca878f969c6103c47fbc1e0e4e50bc548032162fc5cd63a6c193fe00aa232981ea45f2d5d0c9a2979c9e51838651916103ba83611d2b565b89835233306121d6565b51612894565b928c81528d895220015551945116898b5116908d519251948d519687528601528b850152336060850152608084015260a083015260c0820152a28a8a5286526005838a20015415610420575b88600161012d5580f35b8060a0986007857fe81b3c7688efbf6150d5e8ae9fa2b9052b63884e41b20b4851de551a1a82098e9c2001600260ff19825416179055519751169151169251935194825196875286015284015260608301526080820152a238818180808080808080610416565b86513d8e823e3d90fd5b506108fc61036c565b885162461bcd60e51b81529081018c90526014602482015273496e73756666696369656e742062616c616e636560601b6044820152606490fd5b8f6011602492634e487b7160e01b835252fd5b875162461bcd60e51b81529081018b9052602260248201527f5468657265206973206e6f7420656e6f75676820746f6b656e7320746f2073656044820152611b1b60f21b6064820152608490fd5b91505051600381101561054d578d901561031e610302565b50634e487b7160e01b8f526021905260248efd5b505090346101ac57602090816003193601126108505761057f611ce3565b84549160ff8360081c161591828093610843575b801561082c575b156107d257600193838560ff1983161789556107c1575b5061016580546001600160a01b0319166001600160a01b039092169190911790558451906105de82611d2b565b8682526105fa60ff885460081c166105f5816126f2565b6126f2565b8151906001600160401b0382116107ae57508061061860cb546126a1565b92601f93848111610777575b50869084831160011461071657899261070b575b5050600019600383901b1c191690841b1760cb555b61067360ff875460081c16610661816126f2565b61066a816126f2565b6105f5816126f2565b8261012d556101649061068682546126a1565b8181116106ed575b5050602a7468747470733a2f2f697066732e696f2f697066732f60581b0190556106b6578380f35b7f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989261ff0019855416855551908152a13880808380f35b61070491838952868920910160051c8101906126db565b388061068e565b015190503880610638565b60cb8a52878a208794509190601f1984168b5b8a8282106107615750508411610748575b505050811b0160cb5561064d565b015160001960f88460031b161c1916905538808061073a565b8385015186558a97909501949384019301610729565b61079f9060cb8b52888b208680860160051c8201928b87106107a5575b0160051c01906126db565b38610624565b92508192610794565b634e487b7160e01b885260419052602487fd5b61ffff1916610101178755386105b1565b855162461bcd60e51b8152808301869052602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b15801561059a5750600160ff85161461059a565b50600160ff851610610593565b8380fd5b505090346101ac5760203660031901126101ac57602092829135815260fb845220549051908152f35b8483346101f65760209061089036611e7c565b50505050505163bc197c8160e01b8152f35b5050346101ac57806003193601126101ac576108bc611ce3565b906024359182151580930361024f576001600160a01b031692338414610919575033845260ca60205280842083855260205280842060ff1981541660ff841617905551908152600080516020612a6383398151915260203392a380f35b6020608492519162461bcd60e51b835282015260296024820152600080516020612a83833981519152604482015268103337b91039b2b63360b91b6064820152fd5b8385346101ce576020806003193601126101f6576001600160401b0383358181116108505761098d9036908601611d69565b936109a460018060a01b0361016554163314612656565b8451918211610a9b5750610164916109bc83546126a1565b601f8111610a62575b5080601f8311600114610a0057508394829394926109f5575b50508160011b916000199060031b1c191617905580f35b0151905084806109de565b90601f198316958486528286209286905b888210610a4a57505083600195969710610a31575b505050811b01905580f35b015160001960f88460031b161c19169055848080610a26565b80600185968294968601518155019501930190610a11565b610a8b90848652828620601f850160051c810191848610610a91575b601f0160051c01906126db565b856109c5565b9091508190610a7e565b634e487b7160e01b845260419052602483fd5b8483346101f657816003193601126101f657610adf90610acc6128a1565b9051918291602083526020830190611de2565b0390f35b84848492346101ac57826003193601126101ac5761016093929354918492855b818110610d54575085610b1585611e07565b94610b2287519687611d46565b808652610b31601f1991611e07565b01875b818110610d0757505086905b828210610c075750505083519485946020908187019282885286518094528282890197019581925b858410610b75578989038af35b919395979087819496989a505180518352878101518884015260018060a01b03808583015116858501526060908183015116908401526080808201519084015260a0808201519084015260c0808201519084015201516003811015610bf457610100828892866001950152019901940191899897959391969496610b68565b634e487b7160e01b855260218952602485fd5b60019793959697808301808411610cf4578552602061016381528960018060a01b036003338282858c2001541614610c54575b505050505090610c499061200b565b909695949296610b40565b8260ff92600792610cb6958c2092805197610c6e89611cf9565b84548952898501549089015282600285015416908801528201541660608601528b8101546080860152600581015460a0860152600681015460c08601520154168883016127d9565b610cc0838a612030565b52610ccb8289612030565b508101809111610ce157610c4989898180610c3a565b634e487b7160e01b845260118652602484fd5b634e487b7160e01b865260118852602486fd5b602090889995979851610d1981611cf9565b868152828781830152878c8301528760608301528760808301528760a08301528760c08301528789830152828b010152019796959397610b34565b60019692949596808201808311610dbf578452610163602052878420600301546001600160a01b03163314610d98575b50610d8e9061200b565b9594939195610b03565b86919601809111610dac5794610d8e610d84565b634e487b7160e01b835260118552602483fd5b634e487b7160e01b855260118752602485fd5b505090346101ac5760203660031901126101ac57602092829135815260fb8452205415159051908152f35b505090346101ac57816003193601126101ac5780356001600160401b0380821161024f573660238301121561024f578183013590610e3a82611e07565b92610e4786519485611d46565b82845260209260248486019160051b83010191368311610f9757602401905b828210610f7457505050602435908111610f7057610e879036908501611e1e565b928251845103610f1d5750815194610e9e86611e07565b95610eab86519788611d46565b808752610eba601f1991611e07565b0136838801375b8251811015610f0b57610f0690610ef66001600160a01b03610ee38387612030565b5116610eef8388612030565b5190611f86565b610f008289612030565b5261200b565b610ec1565b845182815280610adf81850189611efd565b60849185519162461bcd60e51b8352820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b6064820152fd5b8580fd5b81356001600160a01b0381168103610f93578152908401908401610e66565b8980fd5b8880fd5b838584346101f657610fac36611e7c565b909692959390926001600160a01b039182169291338414801561137b575b610fd39061205a565b8251895103611327578716938415610feb8115612110565b84156112d4575b61122a575b855b835181101561107c57806110106110779286612030565b5161101b828d612030565b5190808a5260c96020918183528c8c208a8d528352838d8d8c82822054926110458585101561216a565b858352868852822091528552038d8d20558b5281528a8a2090898b52526110708a8a209182546121c9565b905561200b565b610ff9565b509293909691859892828689518a81527f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb6110b98c830187611efd565b918083036020820152806110ce33948b611efd565b0390a43b6110da578580f35b879561112d9561113c61111a956020978b51998a988997889663bc197c8160e01b9e8f89523390890152602488015260a0604488015260a4870190611efd565b6003199384878303016064880152611efd565b91848303016084850152611de2565b03925af18591816111fa575b506111cb5750506001611159612540565b6308c379a014611194575b6111775750505b81808281808080808580f35b5162461bcd60e51b8152915081906111909082016125cc565b0390fd5b61119c61255e565b806111a75750611164565b905061119091602094505193849362461bcd60e51b85528401526024830190611de2565b6001600160e01b031916036111e157505061116b565b5162461bcd60e51b8152915081906111909082016124f7565b61121c91925060203d8111611223575b6112148183611d46565b8101906124d7565b9086611148565b503d61120a565b9691928596959491945b84518110156112c5576112478186612030565b51611252828c612030565b5190808a5260fb60208181528a8c205492848410611283578c5252888a20919003905561127e9061200b565b611234565b8b5162461bcd60e51b8152808c0183905260286024820152600080516020612ac3833981519152604482015267616c537570706c7960c01b6064820152608490fd5b50929196959495939093610ff7565b98949297939190865b895181101561131a57806112f46113159289612030565b516112ff828d612030565b518a5260fb6020526110708b8b209182546121c9565b6112dd565b5090919397929498610ff2565b865162461bcd60e51b8152602081840152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b6064820152608490fd5b5083865260ca602090815287872033885290528686205460ff16610fca565b90508391346101ac5760603660031901126101ac5783356024356044356113bf6127fb565b6113cb61031984612948565b6113d6821515612790565b816113e18433611f86565b1061153e5761016060076001825401968780935586519061140182611cf9565b8382528960208301888152898401308152606085019033825260808601928a84528c60a08801958c875260c08901978c895289019a818c5281526101636020522096518755516001870155600286019060018060a01b03809151169160018060a01b031992838254161790556003870192511690825416179055518c840155516005830155516006820155019051600381101561152b57917f87ed4be4e4ee79014a64d9fc4a9d0a961f4f5f16189cd3d94648ed66ca50116b9594939161151f9360ff801983541691161790556114e885516114dc81611d2b565b898152838630336120bd565b6114f184612966565b918551958695865230602087015233908601526060850152608084015260c060a084015260c0830190611de2565b0390a2600161012d5580f35b634e487b7160e01b885260218952602488fd5b835162461bcd60e51b8152602081890152601d60248201527f496e73756666696369656e742062616c616e636520666f72206c6973740000006044820152606490fd5b505082346101ce5760203660031901126101ce5750610acc610adf9235612966565b505090346101ac5760203660031901126101ac57359063ffffffff60e01b82168092036101ac5760209250636cdb3d1360e11b821491821561161e575b82156115f0575b50519015158152f35b909150630271189760e51b811490811561160d575b5090386115e7565b6301ffc9a760e01b14905038611605565b6303a24d0760e21b811492506115e0565b5050346101ac57806003193601126101ac576001600160401b03918035919060248035858111611a52576116669036908401611d69565b61167c60018060a01b0361016554163314612656565b60019461015f91868354018093558289526020976101618952868a203360018060a01b03198254161790556101628952868a20918051918211611a405781908b8b6116c786546126a1565b601f8111611a11575b5050508a90601f83116001146119b1578c926119a6575b5050600019600383901b1c191690881b1790555b84519161170783611d2b565b888352331561195a57889291818861171f8b94612621565b61172884612621565b87835b611906575b5050505080855260c9835287852033865283528785206117518382546121c9565b905587518181528284820152853391600080516020612aa38339815191528b3392a4333b6117ff575b50505050503033146117bf57505033845260ca835280842030855283528084208260ff1982541617905551908152600080516020612a6383398151915230923392a380f35b60299085608494519362461bcd60e51b8552840152820152600080516020612a83833981519152604482015268103337b91039b2b63360b91b6064820152fd5b6118398851948593849363f23a6e6160e01b98898652338c8701528a8601526044850152606484015260a0608484015260a4830190611de2565b03818b335af18891816118e7575b506118be57505083611857612540565b6308c379a01461188b575b611871575b853886818061177a565b50905162461bcd60e51b81529081906111909082016125cc565b61189361255e565b8061189e5750611862565b92945050611190925194859462461bcd60e51b8652850152830190611de2565b6001600160e01b031916146118675750905162461bcd60e51b81529081906111909082016124f7565b6118ff919250883d8a11611223576112148183611d46565b9038611847565b909192939495835182101561195157906119449160fb6119268386612030565b51916119328488612030565b518c52526110708d8b209182546121c9565b908392918d96959461172b565b95949392611730565b855162461bcd60e51b81528086018990526021818601527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b6064820152608490fd5b0151905038806116e7565b848d528b8d208b94509190601f1984168e8e5b8282106119fa57505084116119e1575b505050811b0190556116fb565b015160001960f88460031b161c191690553880806119d4565b8385015186558e979095019493840193018e6119c4565b818388611a3895522090601f860160051c8201928610610a9157601f0160051c01906126db565b8b8b386116d0565b634e487b7160e01b8b5260418752858bfd5b8680fd5b8483346101f657806003193601126101f657602090611a7f611a76611ce3565b60243590611f86565b9051908152f35b929190503461085057611a9836611cc8565b9093611aa26127fb565b8486526101639360209385855280882092815192611abf84611cf9565b84548452600185015487850190815260018060a01b039182600288015416998587019a8b5287846003820154169560608901968752838201549860808101998a52611b2d60ff6007600660058701549660a0860197885201549d60c085019e8f5201541692820192836127d9565b868851163303611c875751151580611c5f575b611b4a9150612852565b611b576103198551612948565b611b628a1515612790565b89815110611c1057928c85938f988d9b997f686a736c00161c1a5a9c35ddee0125551ffd0628a321eef9c060809c3826e9049f9d9b99979560c09f81611bc18f869d9a6103c48b51838a5191611bb783611d2b565b8a835233306120bd565b918785525260058484200155611bd88d8c51612894565b9482528d5220015551985116915116925193519582519788528701528501526060840152608083015260a0820152a2600161012d5580f35b865162461bcd60e51b81528084018c90526024808201527f5468657265206973206e6f7420656e6f75676820746f6b656e7320746f2063616044820152631b98d95b60e21b6064820152608490fd5b50516003811015611c7457611b4a9015611b40565b634e487b7160e01b8f526021845260248ffd5b885162461bcd60e51b81528086018e9052601b60248201527a27b7363c9037bbb732b91031b0b71031b0b731b2b61037b93232b960291b6044820152606490fd5b6040906003190112611cde576004359060243590565b600080fd5b600435906001600160a01b0382168203611cde57565b61010081019081106001600160401b03821117611d1557604052565b634e487b7160e01b600052604160045260246000fd5b602081019081106001600160401b03821117611d1557604052565b601f909101601f19168101906001600160401b03821190821017611d1557604052565b81601f82011215611cde578035906001600160401b038211611d155760405192611d9d601f8401601f191660200185611d46565b82845260208383010111611cde57816000926020809301838601378301015290565b60005b838110611dd25750506000910152565b8181015183820152602001611dc2565b90602091611dfb81518092818552858086019101611dbf565b601f01601f1916010190565b6001600160401b038111611d155760051b60200190565b81601f82011215611cde57803591611e3583611e07565b92611e436040519485611d46565b808452602092838086019260051b820101928311611cde578301905b828210611e6d575050505090565b81358152908301908301611e5f565b60a0600319820112611cde576001600160a01b03916004358381168103611cde57926024359081168103611cde57916001600160401b0391604435838111611cde5782611ecb91600401611e1e565b92606435818111611cde5783611ee391600401611e1e565b92608435918211611cde57611efa91600401611d69565b90565b90815180825260208080930193019160005b828110611f1d575050505090565b835185529381019392810192600101611f0f565b60a0600319820112611cde576001600160a01b03916004358381168103611cde57926024359081168103611cde57916044359160643591608435906001600160401b038211611cde57611efa91600401611d69565b6001600160a01b0316908115611fb35760005260c960205260406000209060005260205260406000205490565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b6064820152608490fd5b600019811461201a5760010190565b634e487b7160e01b600052601160045260246000fd5b80518210156120445760209160051b010190565b634e487b7160e01b600052603260045260246000fd5b1561206157565b60405162461bcd60e51b815260206004820152602e60248201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60448201526d195c881bdc88185c1c1c9bdd995960921b6064820152608490fd5b6120e894939291906001600160a01b03811633811480156120ea575b6120e3915061205a565b6121d6565b565b5060005260ca6020526040600020336000526020526120e360ff604060002054166120d9565b1561211757565b60405162461bcd60e51b815260206004820152602560248201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b1561217157565b60405162461bcd60e51b815260206004820152602a60248201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60448201526939103a3930b739b332b960b11b6064820152608490fd5b9190820180921161201a57565b90936001600160a01b0380861694919385159390916121f58515612110565b6121fe83612621565b9061220885612621565b921694851561247a575b6123c0575b505060009381855260209560c98752604097888720868852885284898820546122428282101561216a565b85895260c98a528a8920888a528a52038988205583875260c9885288872082885288528887206122738682546121c9565b905581868a51868152878b820152600080516020612aa38339815191528c3392a43b6122a4575b5050505050505050565b6122e6938688948a519687958694859363f23a6e6160e01b9b8c865233600487015260248601526044850152606484015260a0608484015260a4830190611de2565b03925af18391816123a1575b50612371575050600191612304612540565b6308c379a01461233b575b505061232457505b388080808080808061229a565b5162461bcd60e51b815280611190600482016125cc565b61234361255e565b918261234f575061230f565b8461119091505192839262461bcd60e51b845260048401526024830190611de2565b6001600160e01b03191603915061238a90505750612317565b5162461bcd60e51b815280611190600482016124f7565b6123b9919250853d8711611223576112148183611d46565b90386122f2565b95926000989592979491985b8751811015612469576123df8189612030565b516123ea828c612030565b518160005260fb9160209280845260409384600020549284841061242657906124219695949392916000525203906000205561200b565b6123cc565b855162461bcd60e51b81526004810183905260286024820152600080516020612ac3833981519152604482015267616c537570706c7960c01b6064820152608490fd5b509295509295909396503880612217565b97936000999591979396929996875b89518110156124c757806124a06124c2928e612030565b516124ab828d612030565b518b5260fb60205261107060408c209182546121c9565b612489565b5093979195999296509397612212565b90816020910312611cde57516001600160e01b031981168103611cde5790565b60809060208152602860208201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b60608201520190565b60009060033d1161254d57565b905060046000803e60005160e01c90565b600060443d10611efa57604051600319913d83016004833e81516001600160401b03918282113d6024840111176125bb578184019485519384116125c3573d850101602084870101116125bb5750611efa92910160200190611d46565b949350505050565b50949350505050565b60809060208152603460208201527f455243313135353a207472616e7366657220746f206e6f6e2d455243313135356040820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60608201520190565b60408051919082016001600160401b03811183821017611d155760405260018252602082016020368237825115612044575290565b1561265d57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b90600182811c921680156126d1575b60208310146126bb57565b634e487b7160e01b600052602260045260246000fd5b91607f16916126b0565b8181106126e6575050565b600081556001016126db565b156126f957565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b1561275957565b60405162461bcd60e51b815260206004820152600f60248201526e151bdad95b881b9bdd08199bdd5b99608a1b6044820152606490fd5b1561279757565b60405162461bcd60e51b815260206004820152601a602482015279125b9d985b1a5908185c99dd5b595b9d081bd988185b5bdd5b9d60321b6044820152606490fd5b60038210156127e55752565b634e487b7160e01b600052602160045260246000fd5b61012d600281541461280d5760029055565b60405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606490fd5b1561285957565b60405162461bcd60e51b81526020600482015260136024820152724974656d207761736e2774206c697374696e6760681b6044820152606490fd5b9190820391821161201a57565b60405190600082610164918254926128b8846126a1565b90818452600194858116908160001461292557506001146128e2575b50506120e892500383611d46565b9093915060005260209081600020936000915b81831061290d5750506120e8935082010138806128d4565b855488840185015294850194879450918301916128f5565b9150506120e894506020925060ff191682840152151560051b82010138806128d4565b600090815261016160205260409020546001600160a01b0316151590565b61297261031982612948565b600090815260209061016282526040812061298b6128a1565b916040519080835461299c816126a1565b91828552878501956001928381169081600014612a405750600114612a09575b5050505091816129d6611efa95936129fd97950382611d46565b60405195836129ee8895518092888089019101611dbf565b84019151809386840190611dbf565b01038084520182611d46565b90809450528683205b828410612a2d5750505081018401816129d6816129fd6129bc565b8054858501890152928701928101612a12565b60ff1916885250505050151560051b820185019050816129d6816129fd6129bc56fe17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31455243313135353a2073657474696e6720617070726f76616c20737461747573c3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62455243313135353a206275726e20616d6f756e74206578636565647320746f74a26469706673582212209437455b5f1f1c186b8c3adfcc3307901bac7cb1ccf897c680d9b9ad6192929064736f6c63430008110033";

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
