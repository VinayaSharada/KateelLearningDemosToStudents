// NFT Module - ERC-721, ERC-1155, and Token Economics

const NFTModule = (() => {
  // ============ ERC-721 Standard (Non-Fungible Tokens) ============
  const erc721Standard = {
    name: 'ERC-721',
    fullName: 'Ethereum Request for Comments 721',
    type: 'Non-Fungible Token',
    description: 'Each tokenId is unique and non-interchangeable',
    standardFunctions: [
      { name: 'balanceOf(owner)', description: 'Returns number of tokens owned by an address' },
      { name: 'ownerOf(tokenId)', description: 'Returns address that owns the token' },
      { name: 'transferFrom(from, to, tokenId)', description: 'Transfers token to new owner' },
      { name: 'approve(to, tokenId)', description: 'Approves address to transfer token' },
      { name: 'setApprovalForAll(operator, approved)', description: 'Approves operator for all tokens' },
      { name: 'getApproved(tokenId)', description: 'Returns approved address for token' },
      { name: 'isApprovedForAll(owner, operator)', description: 'Checks if operator approved for all' }
    ],
    useCases: [
      'Digital art and collectibles',
      'Virtual real estate',
      'Domain names (ENS)',
      'In-game items',
      'Certificates and credentials'
    ],
    examples: [
      'CryptoPunks - 10,000 unique pixel art characters',
      'Bored Ape Yacht Club - 10,000 unique ape avatars',
      'OpenSea - marketplace for ERC-721 tokens'
    ]
  };

  // ============ ERC-1155 Standard (Semi-Fungible Tokens) ============
  const erc1155Standard = {
    name: 'ERC-1155',
    fullName: 'Ethereum Request for Comments 1155',
    type: 'Semi-Fungible / Multi-Token Standard',
    description: 'Single contract can contain both fungible and non-fungible tokens',
    standardFunctions: [
      { name: 'balanceOf(account, id)', description: 'Returns balance of specific token type' },
      { name: 'balanceOfBatch(accounts, ids)', description: 'Returns balances for multiple tokens' },
      { name: 'safeTransferFrom(from, to, id, amount, data)', description: 'Safely transfers tokens' },
      { name: 'safeBatchTransferFrom(from, to, ids, amounts, data)', description: 'Batch transfer multiple token types' },
      { name: 'setApprovalForAll(operator, approved)', description: 'Approves operator for all tokens' }
    ],
    advantages: [
      'Single contract for multiple token types (efficient)',
      'Batch operations reduce gas costs',
      'Supports both fungible and non-fungible tokens',
      'Better for gaming and complex scenarios'
    ],
    useCases: [
      'Gaming items (both unique and stackable)',
      'Fractional NFT ownership',
      'Metaverse assets',
      'Multi-type marketplaces'
    ]
  };

  // ============ NFT Metadata Standard ============
  const metadataStandard = {
    name: 'ERC-721 Metadata Extension',
    fields: {
      name: 'Human-readable name of the token',
      description: 'Prose description of the token',
      image: 'URL to the token image',
      attributes: 'Array of trait objects (rarity/properties)',
      external_url: 'URL that represents the token outside ecosystem'
    },
    exampleMetadata: {
      name: 'Bored Ape #1234',
      description: 'Bored Ape Yacht Club NFT',
      image: 'ipfs://QmRRPWG96cmgTn2JSRStDHVmPSEvnNgUqp7EEcTBLvApEj',
      attributes: [
        { trait_type: 'Background', value: 'Blue' },
        { trait_type: 'Body', value: 'Gold Fur' },
        { trait_type: 'Eyes', value: 'Sleepy' },
        { trait_type: 'Mouth', value: 'Grin' }
      ],
      external_url: 'https://boredapeyachtclub.com/ape/1234'
    }
  };

  // ============ NFT Minting ============
  const mintNFT = (name, description, imageUrl, attributes = []) => {
    const tokenId = Math.floor(Math.random() * 10000000);
    const contractAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

    const metadata = {
      name: name,
      description: description,
      image: imageUrl || generatePlaceholderImage(),
      attributes: attributes,
      external_url: `https://opensea.io/assets/${contractAddress}/${tokenId}`,
      tokenId: tokenId,
      contractAddress: contractAddress,
      owner: '0x1234567890123456789012345678901234567890',
      mintedAt: new Date().toISOString(),
      tokenURI: `ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/${tokenId}`
    };

    return metadata;
  };

  const generatePlaceholderImage = () => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23${Math.floor(Math.random()*16777215).toString(16)}' width='400' height='400'/%3E%3C/svg%3E`;
  };

  // ============ NFT Economics & Royalties ============
  const calculateRoyalties = (floorPrice, royaltyPercent = 10) => {
    const platformFee = floorPrice * 0.025; // 2.5% platform fee
    const creatorRoyalty = floorPrice * (royaltyPercent / 100);
    const sellerAmount = floorPrice - platformFee - creatorRoyalty;

    return {
      floorPrice: floorPrice,
      platformFee: platformFee,
      platformFeePercent: 2.5,
      creatorRoyalty: creatorRoyalty,
      royaltyPercent: royaltyPercent,
      sellerAmount: sellerAmount,
      breakdown: {
        seller: ((sellerAmount / floorPrice) * 100).toFixed(1) + '%',
        creator: ((creatorRoyalty / floorPrice) * 100).toFixed(1) + '%',
        platform: '2.5%'
      }
    };
  };

  // ============ Collection Statistics ============
  const collectionStats = {
    'Bored Ape Yacht Club': {
      name: 'Bored Ape Yacht Club',
      standard: 'ERC-721',
      totalSupply: 10000,
      floorPrice: 45.5,
      floorPriceUSD: 81900,
      marketCap: 459000000,
      uniqueHolders: 5200,
      volume24h: 85.3,
      volume24hUSD: 153540,
      royaltyPercent: 2.5,
      created: '2021-04-23',
      transactions: 245000
    },
    'Decentraland LAND': {
      name: 'Decentraland LAND',
      standard: 'ERC-721',
      totalSupply: 91601,
      floorPrice: 3.2,
      floorPriceUSD: 5760,
      marketCap: 527000000,
      uniqueHolders: 28000,
      volume24h: 12.5,
      volume24hUSD: 22500,
      royaltyPercent: 0,
      created: '2017-01-01',
      transactions: 890000
    },
    'Art Blocks': {
      name: 'Art Blocks',
      standard: 'ERC-721',
      totalSupply: 1500000, // Multiple collections
      floorPrice: 0.5,
      floorPriceUSD: 900,
      marketCap: 1350000000,
      uniqueHolders: 250000,
      volume24h: 250.0,
      volume24hUSD: 450000,
      royaltyPercent: 10.0,
      created: '2020-11-01',
      transactions: 3500000
    }
  };

  // ============ Fractional NFTs (ERC-1155) ============
  const createFractionalNFT = (originalNFTName, totalFractions = 1000) => {
    return {
      originalNFT: originalNFTName,
      fractionTokenName: `f${originalNFTName}`,
      totalFractions: totalFractions,
      fractionPrice: 100 / totalFractions, // Assume original worth $100
      benefits: [
        'Lower barrier to entry for expensive NFTs',
        'Liquidity: easier to buy/sell fractions than whole NFT',
        'Risk distribution: multiple owners',
        'Governance: fractional holders can vote on decisions'
      ],
      example: {
        originalNFT: 'Bored Ape #1234 (worth $50,000)',
        totalFractions: 50000,
        pricePerFraction: 1.0,
        requirements: 'Now 50,000 people can own a piece, each with $1 investment'
      }
    };
  };

  // ============ Smart Contract Code (ERC-721 Simplified) ============
  const erc721ContractCode = `pragma solidity ^0.8.0;

contract ERC721 {
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256) {
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        return _owners[tokenId];
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        require(_owners[tokenId] == from, "From address is not token owner");
        require(to != address(0), "Cannot transfer to zero address");

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) external {
        address owner = _owners[tokenId];
        require(msg.sender == owner || _operatorApprovals[owner][msg.sender],
                "Not authorized to approve");
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }
}`;

  // ============ Public API ============
  return {
    erc721Standard,
    erc1155Standard,
    metadataStandard,
    mintNFT,
    calculateRoyalties,
    collectionStats,
    createFractionalNFT,
    erc721ContractCode,
    getStandardComparison: () => ({
      erc721: erc721Standard,
      erc1155: erc1155Standard
    })
  };
})();
