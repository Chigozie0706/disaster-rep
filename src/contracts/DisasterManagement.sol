 // // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import {
//     SelfVerificationRoot
// } from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
// import {
//     ISelfVerificationRoot
// } from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract DisasterManagement is SelfVerificationRoot, Ownable {
//     uint256 internal disasterReportLength = 0;

//     struct DisasterReport {
//         address reporterId;
//         string reporterName;
//         string email;
//         string disasterType;
//         string imgUrl;
//         string latitude;
//         string longitude;
//         string city;
//         string state;
//         string date;
//         string severity;
//         string impact;
//     }

//     struct DisasterImage {
//         address reporterId;
//         string timestamp;
//         string disasterImageUrl;
//     }

//     struct VerificationConfig {
//         bool olderThanEnabled;
//         uint256 olderThan;
//         bool forbiddenCountriesEnabled;
//         uint256[4] forbiddenCountriesListPacked;
//         bool[3] ofacEnabled;
//     }

//     mapping(uint256 => DisasterReport) internal disasterReports;
//     mapping(uint256 => DisasterImage[]) internal disasterImages;

//     VerificationConfig public verificationConfig;

//     // Custom errors for gas efficiency
//     error InvalidReportIndex(uint256 provided, uint256 maxIndex);
//     error UnauthorizedAccess(address caller, address owner);
//     error InvalidImageIndex(uint256 provided, uint256 maxIndex);
//     error EmptyString(string parameter);
//     error UserNotVerified(address user);
//     error AgeVerificationFailed(address user);

//     // Events for frontend integration
//     event DisasterReportCreated(
//         uint256 indexed reportId,
//         address indexed reporterId,
//         string disasterType,
//         string city,
//         string severity
//     );
//     event DisasterReportDeleted(
//         uint256 indexed reportId,
//         address indexed reporterId
//     );
//     event DisasterImageAdded(
//         uint256 indexed reportId,
//         address indexed reporterId,
//         uint256 imageCount
//     );
//     event DisasterImageDeleted(
//         uint256 indexed reportId,
//         address indexed reporterId,
//         uint256 remainingImages
//     );
//     event VerificationConfigUpdated(bool olderThanEnabled, uint256 olderThan);

//     // Constructor to initialize Self Protocol
//     constructor(
//         address hubV2,
//         string memory scopeSeed
//     ) SelfVerificationRoot(hubV2, scopeSeed) Ownable(msg.sender) {
//         // Set default verification config: users must be 18 or older
//         verificationConfig = VerificationConfig({
//             olderThanEnabled: true,
//             olderThan: 18,
//             forbiddenCountriesEnabled: false,
//             forbiddenCountriesListPacked: [
//                 uint256(0),
//                 uint256(0),
//                 uint256(0),
//                 uint256(0)
//             ],
//             ofacEnabled: [false, false, false]
//         });
//     }

//     // Override getConfigId to return your verification config
//     function getConfigId(
//         bytes32,
//         bytes32,
//         bytes memory
//     ) public pure override returns (bytes32) {
//         // Use the default config ID from https://tools.self.xyz/
//         // This config ID should match your verification requirements (18+, etc.)
//         return
//             0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61;
//     }

//     // Override customVerificationHook to handle successful verifications
//     function customVerificationHook(
//         ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
//         bytes memory userData
//     ) internal override {
//         // User has been verified as 18+
//         // You can add custom logic here if needed
//         // For example, emit an event or store verified users
//     }

//     // Input validation modifiers
//     modifier validReportIndex(uint256 _index) {
//         if (_index >= disasterReportLength) {
//             revert InvalidReportIndex(_index, disasterReportLength - 1);
//         }
//         _;
//     }

//     modifier onlyReportOwner(uint256 _index) {
//         if (msg.sender != disasterReports[_index].reporterId) {
//             revert UnauthorizedAccess(
//                 msg.sender,
//                 disasterReports[_index].reporterId
//             );
//         }
//         _;
//     }

//     modifier nonEmptyString(string memory _str) {
//         if (bytes(_str).length == 0) {
//             revert EmptyString("Required parameter cannot be empty");
//         }
//         _;
//     }

//     // Update verification configuration (only owner)
//     function setVerificationConfig(
//         VerificationConfig calldata _config
//     ) external onlyOwner {
//         verificationConfig = _config;
//         emit VerificationConfigUpdated(
//             _config.olderThanEnabled,
//             _config.olderThan
//         );
//     }

//     // Create disaster report with age verification
//     function createDisasterReport(
//         bytes calldata proof,
//         string calldata _reporterName,
//         string calldata _email,
//         string calldata _disasterType,
//         string calldata _imgUrl,
//         string calldata _latitude,
//         string calldata _longitude,
//         string calldata _city,
//         string calldata _state,
//         string calldata _date,
//         string calldata _severity,
//         string calldata _impact
//     ) external nonEmptyString(_reporterName) nonEmptyString(_disasterType) {
//         // Verify user with Self Protocol
//         // The proof parameter will be verified by Self Protocol's verify function
//         // For now, we'll do a basic check - you can enhance this based on Self Protocol's implementation
//         require(proof.length > 0, "Invalid proof");

//         // TODO: Add actual Self Protocol verification here
//         // This would call the verify function from SelfVerificationRoot
//         // For example: require(verify(decodedProof), "Verification failed");

//         uint256 reportId = disasterReportLength;

//         disasterReports[reportId] = DisasterReport({
//             reporterId: msg.sender,
//             reporterName: _reporterName,
//             email: _email,
//             disasterType: _disasterType,
//             imgUrl: _imgUrl,
//             latitude: _latitude,
//             longitude: _longitude,
//             city: _city,
//             state: _state,
//             date: _date,
//             severity: _severity,
//             impact: _impact
//         });

//         disasterReportLength++;

//         emit DisasterReportCreated(
//             reportId,
//             msg.sender,
//             _disasterType,
//             _city,
//             _severity
//         );
//     }

//     // Public helper function to check if user can create report
//     function canCreateReport(
//         bytes calldata proof,
//         address user
//     ) external pure returns (bool) {
//         // Basic validation
//         if (proof.length == 0) return false;
//         if (user == address(0)) return false;

//         // For now, return true if proof exists
//         // TODO: Implement actual Self Protocol verification
//         return true;
//     }

//     function getDisasterReport(
//         uint256 _index
//     )
//         external
//         view
//         validReportIndex(_index)
//         returns (
//             address,
//             string memory,
//             string memory,
//             string memory,
//             string memory,
//             string memory,
//             string memory,
//             string memory,
//             string memory,
//             string memory,
//             string memory,
//             string memory
//         )
//     {
//         DisasterReport memory disasterReport = disasterReports[_index];
//         return (
//             disasterReport.reporterId,
//             disasterReport.reporterName,
//             disasterReport.email,
//             disasterReport.disasterType,
//             disasterReport.imgUrl,
//             disasterReport.latitude,
//             disasterReport.longitude,
//             disasterReport.city,
//             disasterReport.state,
//             disasterReport.date,
//             disasterReport.severity,
//             disasterReport.impact
//         );
//     }

//     function deleteDisasterReport(
//         uint256 id
//     ) external validReportIndex(id) onlyReportOwner(id) {
//         // Delete associated images first
//         delete disasterImages[id];

//         // Move all subsequent reports forward to fill the gap
//         for (uint256 i = id; i < disasterReportLength - 1; i++) {
//             disasterReports[i] = disasterReports[i + 1];
//             disasterImages[i] = disasterImages[i + 1];
//         }

//         // Clear the last element
//         delete disasterReports[disasterReportLength - 1];
//         delete disasterImages[disasterReportLength - 1];

//         disasterReportLength--;

//         emit DisasterReportDeleted(id, msg.sender);
//     }

//     function addDisasterImage(
//         uint256 id,
//         string calldata _imageUrl,
//         string calldata _timestamp
//     )
//         external
//         validReportIndex(id)
//         onlyReportOwner(id)
//         nonEmptyString(_imageUrl)
//     {
//         disasterImages[id].push(
//             DisasterImage({
//                 reporterId: msg.sender,
//                 disasterImageUrl: _imageUrl,
//                 timestamp: _timestamp
//             })
//         );

//         emit DisasterImageAdded(id, msg.sender, disasterImages[id].length);
//     }

//     function getDisasterImages(
//         uint256 id
//     ) external view validReportIndex(id) returns (DisasterImage[] memory) {
//         return disasterImages[id];
//     }

//     function deleteDisasterImage(
//         uint256 id,
//         uint256 imageIndex
//     ) external validReportIndex(id) onlyReportOwner(id) {
//         if (imageIndex >= disasterImages[id].length) {
//             revert InvalidImageIndex(imageIndex, disasterImages[id].length - 1);
//         }

//         // Move the last element to the deleted position
//         uint256 lastIndex = disasterImages[id].length - 1;
//         if (imageIndex != lastIndex) {
//             disasterImages[id][imageIndex] = disasterImages[id][lastIndex];
//         }

//         // Remove the last element
//         disasterImages[id].pop();

//         emit DisasterImageDeleted(id, msg.sender, disasterImages[id].length);
//     }

//     function getDisasterReportLength() external view returns (uint256) {
//         return disasterReportLength;
//     }

//     function getDisasterReportsBatch(
//         uint256 startIndex,
//         uint256 count
//     ) external view returns (DisasterReport[] memory) {
//         if (startIndex >= disasterReportLength) {
//             revert InvalidReportIndex(startIndex, disasterReportLength - 1);
//         }

//         uint256 endIndex = startIndex + count;
//         if (endIndex > disasterReportLength) {
//             endIndex = disasterReportLength;
//         }

//         uint256 actualCount = endIndex - startIndex;
//         DisasterReport[] memory reports = new DisasterReport[](actualCount);

//         for (uint256 i = 0; i < actualCount; i++) {
//             reports[i] = disasterReports[startIndex + i];
//         }

//         return reports;
//     }

//     function getReportsByReporter(
//         address reporter
//     ) external view returns (uint256[] memory reportIds) {
//         uint256 count = 0;
//         for (uint256 i = 0; i < disasterReportLength; i++) {
//             if (disasterReports[i].reporterId == reporter) {
//                 count++;
//             }
//         }

//         reportIds = new uint256[](count);
//         uint256 index = 0;
//         for (uint256 i = 0; i < disasterReportLength; i++) {
//             if (disasterReports[i].reporterId == reporter) {
//                 reportIds[index] = i;
//                 index++;
//             }
//         }

//         return reportIds;
//     }

//     function getVerificationConfig()
//         external
//         view
//         returns (VerificationConfig memory)
//     {
//         return verificationConfig;
//     }
// }
