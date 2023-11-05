import { Web3Storage } from "web3.storage";

function getAccessToken() {
  return process.env.REACT_APP_WEB3_ACCESS_TOKEN;
}

export default function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}
