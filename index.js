// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Auction {
    struct Bid {
        address bidder;
        uint256 amount;
    }

    struct AuctionItem {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 startPrice;
        uint256 startTime;
        uint256 endTime;
        Bid highestBid;
        bool active;
    }

    mapping(uint256 => AuctionItem) public auctions;
    uint256 public auctionId;

    event AuctionCreated(uint256 auctionId, address seller, address nftContract, uint256 tokenId, uint256 startPrice, uint256 startTime, uint256 endTime);
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);

    function createAuction(address nftContract, uint256 tokenId, uint256 startPrice, uint256 startTime, uint256 endTime) external {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");
        auctions[auctionId] = AuctionItem(msg.sender, nftContract, tokenId, startPrice, startTime, endTime, Bid(address(0), 0), true);
        emit AuctionCreated(auctionId, msg.sender, nftContract, tokenId, startPrice, startTime, endTime);
        auctionId++;
    }

    function placeBid(uint256 auctionId) external payable {
        AuctionItem storage auction = auctions[auctionId];
        require(auction.active, "Auction is not active");
        require(block.timestamp >= auction.startTime && block.timestamp <= auction.endTime, "Auction not started or ended");
        require(msg.value > auction.highestBid.amount, "Bid amount too low");
        if (auction.highestBid.bidder != address(0)) {
            payable(auction.highestBid.bidder).transfer(auction.highestBid.amount);
        }
        auction.highestBid = Bid(msg.sender, msg.value);
        emit BidPlaced(auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 auctionId) external {
        AuctionItem storage auction = auctions[auctionId];
        require(block.timestamp > auction.endTime, "Auction not ended yet");
        require(auction.active, "Auction is not active");
        require(auction.highestBid.bidder != address(0), "No bids placed");
        auction.active = false;
        IERC721(auction.nftContract).transferFrom(auction.seller, auction.highestBid.bidder, auction.tokenId);
        payable(auction.seller).transfer(auction.highestBid.amount);
        emit AuctionEnded(auctionId, auction.highestBid.bidder, auction.highestBid.amount);
    }
}