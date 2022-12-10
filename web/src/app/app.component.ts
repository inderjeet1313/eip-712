import { Component } from '@angular/core';
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EIP712 Demo';
  from= '0x7d917A10CfE07ab0EFB4d12C5EcE4bF4c26a1C6d';
  to= '0xC508Ec1381C617AE9aEb6385738c728e2eBC4E22';
  value = 100;
  gas = 21000;
  nonce = 10;

  async connectWallet() {
    if(typeof window.ethereum !== 'undefined') {
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
  }

  async signMessage() {
    if(typeof window.ethereum !== 'undefined') {
      this.connectWallet().then(async (account) => {
        const provider = window.web3.currentProvider;
        const web3Provider = new Web3(provider);
        const acc = await web3Provider.eth.getAccounts();
        const param = this.createMessageParams();        
        provider.sendAsync({
          method: "eth_signTypedData_v4",
          params: [acc[0], param],
          from: acc[0]
        }, async  (err:any, res:any) => {
           if(err) {
            console.log(err)
           }
           console.log("Signed Data - ", res.result)
        });        
      });
    }
  }

  async signMessageOld() {
    if(typeof window.ethereum !== 'undefined') {
      this.connectWallet().then(async (account) => {
        const provider = window.web3.currentProvider;
        const web3Provider = new Web3(provider);
        const acc = await web3Provider.eth.getAccounts();
        const param = this.createMessageParams();        
        provider.sendAsync({
          method: "eth_sign",
          params: [acc[0], Web3.utils.keccak256(param.toString())],
          from: acc[0]
        }, async  (err:any, res:any) => {
           if(err) {
            console.log(err)
           }
           console.log("Signed Data - ", res.result)
        });        
      });
    }
  }

  createMessageParams() {
    return JSON.stringify({
      types: {
        EIP712Domain: [
          {name: "name", type:"string"},
          {name: "version", type: "string"},
          {name: "chainId", type: "uint256"},
          {name: "verifyingContract", type: "address"}
        ],
        ForwardRequest: [
          {name: "from", type: "address"},
          {name: "to", type: "address"},
          {name: "value", type: "uint256"},
          {name: "gas", type: "uint256"},
          {name: "nonce", type: "uint256"}
        ]
      },
      primaryType: "ForwardRequest",
      domain: {
        name: "ForwardRequest",
        version: "1",
        chainId: 5,
        verifyingContract: "0xA11ae4c40BE3883d08cA74Ce051C50BA9c700aa7"
      },
      message: {
        from: this.from,
        to: this.to,
        value: this.value,
        gas: this.gas,
        nonce: this.nonce
      }
    })
  }
}
