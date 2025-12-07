// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract DisasterManagement {
    uint256 internal disasterReportLength = 0;

    struct DisasterReport {
        address reporterId;
        string reporterName;
        string email;
        string disasterType;
        string imgUrl;
        string latitude;
        string longitude;
        string city;
        string state;
        string date;
        string severity;
        string impact;
    }

    struct DisasterImage {
        address reporterId;
        string timestamp;
        string disasterImageUrl;
    }

    mapping(uint256 => DisasterReport) internal disasterReports;
    mapping(uint256 => DisasterImage[]) internal disasterImages;

    function createDisasterReport(
        string memory _reporterName,
        string memory _email,
        string memory _disasterType,
        string memory _imgUrl,
        string memory _latitude,
        string memory _longitude,
        string memory _city,
        string memory _state,
        string memory _date,
        string memory _severity,
        string memory _impact
    ) public {
        disasterReports[disasterReportLength] = DisasterReport({
            reporterId: msg.sender,
            reporterName: _reporterName,
            email: _email,
            disasterType: _disasterType,
            imgUrl: _imgUrl,
            latitude: _latitude,
            longitude: _longitude,
            city: _city,
            state: _state,
            date: _date,
            severity: _severity,
            impact: _impact
        });

        disasterReportLength++;
    }

    function getDisasterReport(
        uint256 _index
    )
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        require(_index < disasterReportLength, "Invalid report index");
        DisasterReport memory disasterReport = disasterReports[_index];
        return (
            disasterReport.reporterId,
            disasterReport.reporterName,
            disasterReport.email,
            disasterReport.disasterType,
            disasterReport.imgUrl,
            disasterReport.latitude,
            disasterReport.longitude,
            disasterReport.city,
            disasterReport.state,
            disasterReport.date,
            disasterReport.severity,
            disasterReport.impact
        );
    }

    function deleteDisasterReport(uint256 id) public {
        require(id < disasterReportLength, "Invalid report index");
        require(
            msg.sender == disasterReports[id].reporterId,
            "Please ensure you are the owner of this request"
        );

        delete disasterImages[id];

        for (uint256 i = id; i < disasterReportLength - 1; i++) {
            disasterReports[i] = disasterReports[i + 1];
            disasterImages[i] = disasterImages[i + 1];

            delete disasterReports[disasterReportLength - 1];
            delete disasterImages[disasterReportLength - 1];
        }

        disasterReportLength--;
    }

    function addDisasterImage(
        uint256 id,
        string memory _imageUrl,
        string memory _timestamp
    ) public {
        require(id < disasterReportLength, "Invalid report index");
        require(
            msg.sender == disasterReports[id].reporterId,
            "You are not the owner of this report"
        );
        disasterImages[id].push(
            DisasterImage({
                reporterId: msg.sender,
                disasterImageUrl: _imageUrl,
                timestamp: _timestamp
            })
        );
    }

    function getDisasterImages(
        uint256 id
    ) public view returns (DisasterImage[] memory) {
        require(id < disasterReportLength, "Invalid report index");
        return disasterImages[id];
    }

    function deleteDisasterImage(uint256 id, uint256 imageIndex) public {
        require(id < disasterReportLength, "Invalid report ID");
        require(
            msg.sender == disasterReports[id].reporterId,
            "You are not the owner of this report"
        );
        require(imageIndex < disasterImages[id].length, "Invalid image index");

        disasterImages[id][imageIndex] = disasterImages[id][
            disasterImages[id].length - 1
        ];

        disasterImages[id].pop();
    }

    function getDisasterReportLength() public view returns (uint256) {
        return (disasterReportLength);
    }
}
