import { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0xaD520D7e08F795458f6b44Ec5e587BDa43A8aa7E";

const abi = [
  "function logFlight(string memory _droneId, string memory _route)",
  "function getFlights() view returns (tuple(uint id, string droneId, string route, uint timestamp, address owner)[])"
];

function App() {
  const [account, setAccount] = useState("");
  const [droneId, setDroneId] = useState("");
  const [route, setRoute] = useState("");
  const [flights, setFlights] = useState([]);

  async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());
  }

  async function logFlight() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.logFlight(droneId, route);
    await tx.wait();

    setDroneId("");
    setRoute("");
    loadFlights();
  }

  async function loadFlights() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const data = await contract.getFlights();
    setFlights(data);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚁 Drone Flight Logger</h1>

      <button style={styles.connectBtn} onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0,6)}...` : "Connect Wallet"}
      </button>

      <div style={styles.card}>
        <h2>Log Flight</h2>
        <input
          style={styles.input}
          placeholder="Drone ID"
          value={droneId}
          onChange={(e) => setDroneId(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Route (e.g. London → Paris)"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
        />
        <button style={styles.button} onClick={logFlight}>
          Log Flight
        </button>
      </div>

      <div style={styles.card}>
        <h2>Flights</h2>
        <button style={styles.button} onClick={loadFlights}>
          Load Flights
        </button>

        <ul style={styles.list}>
          {flights.map((f, i) => (
            <li key={i} style={styles.item}>
              <strong>{f.droneId}</strong>
              <br />
              {f.route}
              <br />
              <small>
                {new Date(Number(f.timestamp) * 1000).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "Arial",
    textAlign: "center"
  },
  title: {
    marginBottom: "20px"
  },
  connectBtn: {
    padding: "10px 20px",
    marginBottom: "20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px"
  },
  card: {
    background: "#f5f5f5",
    padding: "20px",
    margin: "20px 0",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 20px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  item: {
    background: "white",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }
};

export default App;