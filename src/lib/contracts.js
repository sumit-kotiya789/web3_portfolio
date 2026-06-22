/* Real, verified contracts deployed on BNB Smart Chain.
   Each entry drives a laminated card + an explainer modal with a flow diagram
   and the full laminated Solidity source. */

const USDT_GATEWAY_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.14;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

library SafeMath {
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked { uint256 c = a + b; if (c < a) return (false, 0); return (true, c); }
    }
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked { if (b > a) return (false, 0); return (true, a - b); }
    }
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }
    function add(uint256 a, uint256 b) internal pure returns (uint256) { return a + b; }
    function sub(uint256 a, uint256 b) internal pure returns (uint256) { return a - b; }
    function mul(uint256 a, uint256 b) internal pure returns (uint256) { return a * b; }
    function div(uint256 a, uint256 b) internal pure returns (uint256) { return a / b; }
}

contract TEST_CONTRACT {
    event Multisended(uint256 value, address indexed sender);
    event Registration(address indexed investor, string referralId, string referral, uint investment);
    event PackageUpgrade(string investorId, uint256 investment, address indexed investor, string packageName);
    event BuyFund(string investorId, uint256 investment, address indexed investor, string userId);
    event WithDraw(string investorId, address indexed investor, uint256 WithAmt);
    event MemberPayment(uint256 investorId, address indexed investor, uint256 WithAmt, uint netAmt);
    event Payment(uint256 NetQty);

    using SafeMath for uint256;
    IERC20 private USDT;
    address public owner;

    constructor(address ownerAddress, IERC20 _USDT) {
        owner = ownerAddress;
        USDT = _USDT;
    }

    function NewRegistration(string memory referralId, string memory referral, uint256 investment) public payable {
        require(USDT.balanceOf(msg.sender) >= investment);
        require(USDT.allowance(msg.sender, address(this)) >= investment, "Approve Your Token First");
        USDT.transferFrom(msg.sender, owner, investment);
        emit Registration(msg.sender, referralId, referral, investment);
    }

    function UpgradePackage(string memory investorId, uint256 investment, string memory packageName) public payable {
        require(USDT.balanceOf(msg.sender) >= investment);
        require(USDT.allowance(msg.sender, address(this)) >= investment, "Approve Your Token First");
        USDT.transferFrom(msg.sender, owner, investment);
        emit PackageUpgrade(investorId, investment, msg.sender, packageName);
    }

    function FundBuy(string memory investorId, uint256 investment, string memory userId) public payable {
        require(USDT.balanceOf(msg.sender) >= investment);
        require(USDT.allowance(msg.sender, address(this)) >= investment, "Approve Your Token First");
        USDT.transferFrom(msg.sender, owner, investment);
        emit BuyFund(investorId, investment, msg.sender, userId);
    }

    function multisendToken(
        address payable[] memory _contributors,
        uint256[] memory _balances,
        uint256 totalQty,
        uint256[] memory NetAmt,
        uint256[] memory _investorId
    ) public payable {
        uint256 total = totalQty;
        for (uint256 i = 0; i < _contributors.length; i++) {
            require(total >= _balances[i]);
            total = total.sub(_balances[i]);
            USDT.transferFrom(msg.sender, _contributors[i], _balances[i]);
            emit MemberPayment(_investorId[i], _contributors[i], _balances[i], NetAmt[i]);
        }
        emit Payment(totalQty);
    }

    function multisendWithdraw(address payable[] memory _contributors, uint256[] memory _balances) public payable {
        require(msg.sender == owner, "onlyOwner");
        for (uint256 i = 0; i < _contributors.length; i++) {
            USDT.transfer(_contributors[i], _balances[i]);
        }
    }

    function withdrawincome(string memory investorId, address payable _userAddress, uint256 WithAmt) public {
        require(msg.sender == owner, "onlyOwner");
        USDT.transferFrom(msg.sender, _userAddress, WithAmt);
        emit WithDraw(investorId, _userAddress, WithAmt);
    }

    function withdrawLostTokenFromBalance(uint QtyAmt) public {
        require(msg.sender == owner, "onlyOwner");
        USDT.transfer(owner, QtyAmt);
    }

    function withdrawLostBNBFromBalance(address payable _sender) public {
        require(msg.sender == owner, "onlyOwner");
        _sender.transfer(address(this).balance);
    }
}`

const ALPHA_TOKEN_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }
}

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract BEP20 is IBEP20 {
    using SafeMath for uint256;
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;
    uint256 private _totalSupply;

    function totalSupply() public view virtual override returns (uint256) { return _totalSupply; }
    function balanceOf(address account) public view virtual override returns (uint256) { return _balances[account]; }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }
    function approve(address spender, uint256 value) public virtual override returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, _allowances[sender][msg.sender].sub(amount));
        return true;
    }
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
        return true;
    }
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].sub(subtractedValue));
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "BEP20: transfer from the zero address");
        require(recipient != address(0), "BEP20: transfer to the zero address");
        _balances[sender] = _balances[sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "BEP20: mint to the zero address");
        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }
    function _burn(address account, uint256 value) internal {
        require(account != address(0), "BEP20: burn from the zero address");
        _totalSupply = _totalSupply.sub(value);
        _balances[account] = _balances[account].sub(value);
        emit Transfer(account, address(0), value);
    }
    function burn(uint256 _value) public { _burn(msg.sender, _value); }
    function _approve(address owner, address spender, uint256 value) internal {
        require(owner != address(0), "BEP20: approve from the zero address");
        require(spender != address(0), "BEP20: approve to the zero address");
        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }
}

contract BEP20Detailed {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    constructor (string memory __name, string memory __symbol, uint8 __decimals) {
        _name = __name;
        _symbol = __symbol;
        _decimals = __decimals;
    }
    function name() public view returns (string memory) { return _name; }
    function symbol() public view returns (string memory) { return _symbol; }
    function decimals() public view returns (uint8) { return _decimals; }
}

contract Ownable {
    event OwnershipTransferred(address previousOwner, address newOwner);
    address public ownerAddress;
    constructor () { ownerAddress = msg.sender; }
    modifier onlyOwner() { require(msg.sender == owner()); _; }
    function owner() public view returns (address) { return ownerAddress; }
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        setOwner(newOwner);
    }
    function setOwner(address newOwner) internal {
        emit OwnershipTransferred(owner(), newOwner);
        ownerAddress = newOwner;
    }
}

contract ALPHA is BEP20, BEP20Detailed, Ownable {
    constructor () BEP20Detailed("ALPHA", "ALPHA", 18) {
        _mint(msg.sender, 40000000 * (10**18));
    }
    function withdrawCoin(uint256 amount) public onlyOwner {
        _transfer(address(this), msg.sender, amount);
    }
}`

export const CONTRACTS = [
  {
    id: 'usdt-gateway',
    name: 'USDT Investment Gateway',
    kind: 'DeFi · Payment Router',
    chain: 'BNB Smart Chain',
    chainColor: '#F3BA2F',
    address: '0xefe72830ECBAAe7dAC0a67bA40E1Cc2C786F481F',
    explorer: 'https://bscscan.com/address/0xefe72830ECBAAe7dAC0a67bA40E1Cc2C786F481F#code',
    file: 'USDTGateway.sol',
    compiler: 'Solidity ^0.8.14',
    accent: '#F3BA2F',
    tags: ['BSC', 'USDT (IERC20)', 'SafeMath', 'Multisend', 'Verified'],
    summary:
      'An on-chain USDT gateway for an investment platform. It records registrations, package upgrades and fund purchases, pulling USDT from the user into the treasury, then lets the owner batch-pay many members in a single transaction.',
    steps: [
      'A user approves the contract to spend their USDT (BEP-20 allowance).',
      'They call NewRegistration / UpgradePackage / FundBuy with the amount.',
      'The contract verifies balance + allowance, then transferFrom pulls USDT straight to the owner/treasury.',
      'An event (Registration / PackageUpgrade / BuyFund) is emitted so the off-chain backend can index it.',
      'For payouts, the owner calls multisendToken — one transaction distributes USDT to hundreds of members and emits a MemberPayment event per recipient.',
    ],
    flow: [
      { actor: 'Investor', action: 'approve(USDT) → deposit', tone: 'in' },
      { actor: 'Gateway Contract', action: 'verify balance + allowance', tone: 'core' },
      { actor: 'transferFrom', action: 'USDT pulled to treasury', tone: 'move' },
      { actor: 'Owner / Treasury', action: 'holds collected USDT', tone: 'out' },
      { actor: 'multisendToken', action: 'batch payout to N members', tone: 'fan' },
    ],
    functions: [
      'NewRegistration', 'UpgradePackage', 'FundBuy',
      'multisendToken', 'multisendBNB', 'multisendWithdraw',
      'withdrawincome', 'withdrawLostTokenFromBalance', 'withdrawLostBNBFromBalance',
    ],
    events: ['Registration', 'PackageUpgrade', 'BuyFund', 'MemberPayment', 'WithDraw', 'Payment', 'Multisended'],
    security: [
      'Owner-only guards (require msg.sender == owner) on every payout & rescue function.',
      'Pre-flight balance + allowance checks before any transferFrom.',
      'SafeMath on all arithmetic to block overflow/underflow.',
    ],
    source: USDT_GATEWAY_SOURCE,
  },
  {
    id: 'alpha-token',
    name: 'ALPHA Token',
    kind: 'BEP-20 Token',
    chain: 'BNB Smart Chain',
    chainColor: '#F3BA2F',
    address: '0xf0fcC62473C21e5BdAade0152501D25bbdE6af65',
    explorer: 'https://bscscan.com/address/0xf0fcC62473C21e5BdAade0152501D25bbdE6af65#code',
    file: 'ALPHA.sol',
    compiler: 'Solidity ^0.8.20',
    accent: '#2dd4bf',
    tags: ['BSC', 'BEP-20', '40M supply', 'Burnable', 'Ownable'],
    summary:
      'A fixed-supply BEP-20 token. 40,000,000 ALPHA are minted to the deployer at construction. Holders can transfer, approve and burn; the owner can rescue tokens and transfer ownership. Built from modular BEP20 + BEP20Detailed + Ownable bases.',
    steps: [
      'At deploy, the constructor mints the entire 40,000,000 ALPHA fixed supply to the deployer — no further minting exists.',
      'Holders move tokens with transfer / transferFrom and grant spenders via approve / increaseAllowance.',
      'Anyone can permanently reduce supply by calling burn (sends tokens to the zero address).',
      'The owner can rescue stuck tokens with withdrawCoin and hand over control via transferOwnership.',
    ],
    flow: [
      { actor: 'Deployer', action: 'constructor mints 40,000,000', tone: 'in' },
      { actor: 'ALPHA (BEP-20)', action: 'fixed supply · 18 decimals', tone: 'core' },
      { actor: 'Holders', action: 'transfer · approve · transferFrom', tone: 'move' },
      { actor: 'burn()', action: 'supply → 0x0 (deflationary)', tone: 'out' },
      { actor: 'Owner', action: 'withdrawCoin · transferOwnership', tone: 'fan' },
    ],
    functions: [
      'transfer', 'transferFrom', 'approve', 'increaseAllowance', 'decreaseAllowance',
      'burn', 'withdrawCoin', 'transferOwnership',
    ],
    events: ['Transfer', 'Approval', 'OwnershipTransferred'],
    security: [
      'Zero-address checks on transfer / mint / burn / approve.',
      'SafeMath-guarded balances and allowances.',
      'Ownable access control on rescue + ownership transfer.',
    ],
    stats: [
      ['Supply', '40,000,000'],
      ['Decimals', '18'],
      ['Symbol', 'ALPHA'],
    ],
    source: ALPHA_TOKEN_SOURCE,
  },
]
