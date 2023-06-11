# IMart Indexer

## Pattern

```

        List event Worker                 +-----------------------+                 Buy event worker
 +-------------------------------+        |                       |        +-------------------------------+
 |     +-------------------+     |        |  xxx event worker     |        |    +---------------------+    |
 |     |                   |     |        |                       |        |    |                     |    |
 |     |     Subject       |     |        |                       |        |    |     Subject         |    |
 |     |                   |     |        +-----------------------+        |    |                     |    |
 |     +-----|------^------+     |                                         |    +------|------^-------+    |
 |           |      |            |                                         |           |      |            |
 |           |      |            |      +--------------------------+       |           |      |            |
 (list events    (excuted seq no)|      |  +--------------------+  |       (buy events |      |            |
  / seq no)  |      |            |      |  |    xxx State       |  |       |  / seq no)|   (excuted seq no)|
 |           |      |            |      |  |                    |  |       |           |      |            |
 |  +--------v------|--------+   |      |  |   Offer/Sale ...   |  |       |           |      |            |
 |  |                        |   |      |  |                    |  |       |  +--------v------|--------+   |
 |  |       Observer         |   |      |  | record seq no      |  |       |  |       Observer         |   |
 |  |                        |   |      |  |                    |  |       |  |                        |   |
 |  |                        |   |      |  +--------------------+  |       |  |                        |   |
 |  |   +----------------+   |   |      |  +--------------------+  |       |  |    +---------------+   |   |
 |  |   |  Order List    ---------------|-->    Order state     <--|----------|----| Order buy     |   |   |
 |  |   |                |-\ |   |      |  |                    |  |       |  |    |               |   |   |
 |  |   +----------------+  -\   |      |  | record seq no      |  |       |  |  /-+---------------+   |   |
 |  +------------------------+--\|      |  +--------------------+  |       | /-------------------------+   |
 +--------------------------------\     |                          |      /--------------------------------+
                                   -\   |                          |   /--
                                     --\|                          |---
                                        |\                      /--|
                                        | ->------------------<-+  |
                                        |  |                    |  |
                                        |  |    Activities      |  |
                                        |  |                    |  |
                                        |  | record seq no      |  |
                                        |  |                    |  |
                                        |  +--------------------+  |
                                        +--------------------------+
                                                 DB / Cache
```

## Ganerate prisma client

```
// evm
cd ./evm
npx prisma generate

// aptos
cd ./aptos
python3 -m venv venv
source venv/bin/activate
prisma generate
```

## Deployment

```
// eth
docker build -t indexer-bsc:v1 -f $PWD/docker/bsc.dockerfile $PWD/evm
docker compose up -d indexer-bsc

// bsc
docker build -t indexer-eth:v1 -f $PWD/docker/eth.dockerfile $PWD/evm
docker compose up -d indexer-eth

// aptos
docker build -t indexer-apt:v1 -f $PWD/docker/apt.dockerfile $PWD/apt
docker compose up -d indexer-apt
```

## Log

```
tail -n 10 evm/error.log
tail -n 10 aptos/error.log
```
