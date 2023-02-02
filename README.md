# IMart Event Worker

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
// evm
docker build -t event-worker-evm:v1 -f $PWD/evm/Dockerfile $PWD/evm
docker compose up -d event-worker-evm

// aptos
docker build -t event-worker-aptos:v1 -f $PWD/aptos/Dockerfile $PWD/aptos
docker compose up -d event-worker-aptos

```

## Log

```
tail -n 10 evm/error.log
tail -n 10 aptos/error.log
```
