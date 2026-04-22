// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DroneLogger {

    struct Flight {
        uint id;
        string droneId;
        string route;
        uint timestamp;
        address owner;
    }

    Flight[] public flights;

    event FlightLogged(uint id, string droneId, string route, uint timestamp, address owner);

    function logFlight(string memory _droneId, string memory _route) public {
        flights.push(Flight(
            flights.length,
            _droneId,
            _route,
            block.timestamp,
            msg.sender
        ));

        emit FlightLogged(flights.length - 1, _droneId, _route, block.timestamp, msg.sender);
    }

    function getFlights() public view returns (Flight[] memory) {
        return flights;
    }
}