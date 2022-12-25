import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
// const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });
// const client = create("/ip4/127.0.0.1/tcp/5001");

const ipfsAuth =
  "Basic " +
  Buffer.from(
    process.env.REACT_APP_INFURA_IPFS_PROJECT_ID +
      ":" +
      process.env.REACT_APP_INFURA_IPFS_API_KEY
  ).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "api/v0",
  headers: {
    authorization: ipfsAuth,
  },
});

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const uploadToIPFS = async (event) => {
    event.preventDefault();

    // Choose file from drive
    const file = event.target.files[0];

    if (typeof file !== "undefined") {
      try {
        //upload file to ipfs
        // const isOnline = await client.isOnline();
        // console.log("isOnline", isOnline);

        console.log("uploading");
        const result = await client.add(file);
        console.log(result);

        setImage(`https://ipfs.io/ipfs/${result.path}`); //NOT ipfs.infura.io
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };
  const createNFT = async () => {
    if (!image || !price || !name || !description) return;
    try {
      const result = await client.add(
        JSON.stringify({ image, price, name, description })
      );
      console.log("minting...");
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };
  const mintThenList = async (result) => {
    const uri = `${process.env.REACT_APP_IPFS_URI}/${result.path}`;
    // mint nft
    await (await nft.mint(uri)).wait();

    // get tokenId of new nft
    const id = await nft.tokenCount();

    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();

    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());

    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
