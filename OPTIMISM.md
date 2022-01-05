# Setup a local Optimism Ethereum node

## Install Prerequisite Software

### Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Docker settings

```bash
sudo usermod -a -G docker `whoami`
```

### Docker Compose

```bash
sudo apt install -y docker-compose
```

### Node.js

https://github.com/nvm-sh/nvm#installing-and-updating

## Start an Optimistic Ethereum Node

### Clone the Optimism monorepo

```bash
git clone https://github.com/ethereum-optimism/optimism.git ./optimism
```

### Start the Optimistic Ethereum node

```bash
cd optimism/ops
docker-compose -f docker-compose-nobuild.yml up -t 60
```
