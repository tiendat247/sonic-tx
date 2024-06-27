# Sonic Auto-Transfer

## 1- Prerequisites:
### Install Node.js
```console
# Check version
node --version

# Delete old files
sudo apt-get remove nodejs -y

sudo apt-get purge nodejs

sudo apt-get autoremove

sudo rm /etc/apt/keyrings/nodesource.gpg
sudo rm /etc/apt/sources.list.d/nodesource.list

# Install Nodejs
sudo apt-get update
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install node

#Install the latest version of NPM for Node
nvm install-latest-npm

# Check Nodejs Version
node --version
```

### Install Solana web3.js
```console
npm install --save @solana/web3.js
```

## 2- Clone Repo:
```console
git clone https://github.com/tiendat247/sonic-tx.git
```

## 3- Edit .env:
* You have to set-up a second wallet address to send token to & your main wallet private key in .env file
```console
cd sonic-tx
nano .env

# Copy and Paste this text in the editor
PRIVATE_KEY = your Wallet Private key
RECIPIENT_ADDRESS = your recipient address
```
>  Replace `your Wallet Private key` & `your recipient address`
>
> To save: Ctrl+X+Y Enter
> 
![image](https://github.com/0xmoei/sonic-tx/assets/90371338/6d02cfb8-f7bb-4399-9999-56232071e8ab)


### 4- Run:
```console
# Install
npm install

# Run
node autoxfr.js
```

Close it after 100 txns, and come back tomorrow :D
