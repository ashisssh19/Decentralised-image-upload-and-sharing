import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

export default function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  const renderContent = () => {
    const showAccountInfo = activeTab === "upload" || activeTab === "display";

    return (
      <>
        {showAccountInfo && account && (
          <div className="account-info">
            Connected Account: {account}
          </div>
        )}
        {(() => {
          switch (activeTab) {
            case "about":
              return (
                <div className="floating-content">
                  <h2>What is H.A.M?</h2>
                  <p>
                    H.A.M is a decentralized image sharing and uploading service designed to empower users with full control over their cherished memories. 
                    Leveraging blockchain technology, H.A.M ensures that every photo you upload is stored in a secure, decentralized network, eliminating the 
                    risks associated with centralized servers. Our platform allows users to upload, share, and store their images directly on the blockchain, 
                    providing unmatched security, transparency, and immutability. By decentralizing image storage, H.A.M guarantees that your content remains 
                    accessible, tamper-proof, and safeguarded against loss or censorship. Whether it's personal memories or valuable images, H.A.M provides 
                    a future-proof solution to preserve and share your moments without relying on third-party services. At H.A.M, we believe that your 
                    memories belong to you, and through the power of decentralized technology, we're making sure they stay that way forever.
                  </p>
                </div>
              );
            case "upload":
              return (
                <div className="floating-content">
                  <FileUpload account={account} provider={provider} contract={contract} />
                </div>
              );
            case "display":
              return (
                <div className="floating-content">
                  <Display contract={contract} account={account} />
                </div>
              );
            default:
              return null;
          }
        })()}
      </>
    );
  };

  return (
    <div className="app-container">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <header>
        <div className="header-content">
          <h1 className="logo">H.A.M</h1>
          <nav className="dashboard">
            <button 
              className={`nav-button ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button 
              className={`nav-button ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload Image
            </button>
            <button 
              className={`nav-button ${activeTab === "display" ? "active" : ""}`}
              onClick={() => setActiveTab("display")}
            >
              View Images
            </button>
            <button 
              className="nav-button"
              onClick={() => setModalOpen(true)}
            >
              Share
            </button>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {renderContent()}
        {modalOpen && (
          <Modal setModalOpen={setModalOpen} contract={contract} />
        )}
      </main>
    </div>
  );
}