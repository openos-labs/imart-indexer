# IMart Indexer

## 架构

```

        List event Worker                 +-----------------------+                 Buy event Worker
 +-------------------------------+        |                       |        +-------------------------------+
 |     +-------------------+     |        |  xxx event worker     |        |    +---------------------+    |
 |     |                   |     |        |                       |        |    |                     |    |
 |     |     Producer      |     |        |                       |        |    |     Producer        |    |
 |     |                   |     |        +-----------------------+        |    |                     |    |
 |     +-----|------^------+     |                                         |    +------|------^-------+    |
 |           |      |            |                                         |           |      |            |
 |           |      |            |      +--------------------------+       |           |      |            |
 (list events    (excuted seqno) |      |  +--------------------+  |       (buy events |      |            |
  + seqno)   |      |            |      |  |    xxx State       |  |       |  + seqno) |   (excuted seqno) |
 |           |      |            |      |  |                    |  |       |           |      |            |
 |  +--------v------|--------+   |      |  |   Offer / Sale ... |  |       |           |      |            |
 |  |                        |   |      |  |                    |  |       |  +--------v------|--------+   |
 |  |       Consumer         |   |      |  |   Record seqno     |  |       |  |       Consumer         |   |
 |  |                        |   |      |  |                    |  |       |  |                        |   |
 |  |                        |   |      |  +--------------------+  |       |  |                        |   |
 |  |   +----------------+   |   |      |  +--------------------+  |       |  |    +---------------+   |   |
 |  |   |  Order List    ---------------|-->    Order state     <--|----------|----|  Order Buy    |   |   |
 |  |   |                |-\ |   |      |  |                    |  |       |  |    |               |   |   |
 |  |   +----------------+  -\   |      |  |   Record seqno     |  |       |  |  /-+---------------+   |   |
 |  +------------------------+--\|      |  +--------------------+  |       | /-------------------------+   |
 +--------------------------------\     |                          |      /--------------------------------+
                                   -\   |                          |   /--
                                     --\|                          |---
                                        |\                      /--|
                                        | ->------------------<-+  |
                                        |  |                    |  |
                                        |  |    Sales History   |  |
                                        |  |                    |  |
                                        |  |   Record seqno     |  |
                                        |  |                    |  |
                                        |  +--------------------+  |
                                        +--------------------------+
                                                     DB 
```

历史原因，`Aptos` 链 indexer 使用 python 实现，`Evm` 链 indexer 考虑 `Typechain` 的便捷则用 nodejs 实现；实际上，由于 indexer 作为 IO 密集型的程序，所以即使如带全局解释器锁的 python 也无关紧要；

实现上一个 `worker` 对应一个线程或者基于协程的 `bi-directional channel`, 一个 `worker` 的事件处理机制就是 `Consumer` 订阅并正确消费 `Producer` 产生的事件，`Producer` 通过未处理的 `seqno` 获取新 events，`Consumer` 需要正确处理新的 events 同步数据库状态，同时已处理的 seqno 必须持久化用于程序状态恢复；`Consumer` 通知 `Producer` 处理到哪个 `seqno`, 已处理的 `seqno` 加 1 (aptos 中加 1，evm 中不需要) 就是新的未处理 `seqno`, `Producer` 又继续进行新一轮事件循环；其中比较重要的细节就是同步 events 相关的状态变化到数据库和已处理的 `seqno` 的持久化两个动作需要通过数据库事务保证其原子性；

注：`Evm` 中 `seqno` 对应 `block number`，aptos 中 `seqno` 对应 `sequence number`；在 python 实现中使用了 `async generator` 模拟实现双向 channel，在 nodejs 种则使用 `Rxjs` 里的 `Subject` 模拟实现。

## 生成 prisma client

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

## 部署

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

## 日志

```
tail -n 10 evm/error.log
tail -n 10 aptos/error.log
```
