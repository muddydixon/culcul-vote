Culcul Vote System
-----

カルチャーカルチャーの投票システム。バックエンドのサーバを管理したくないヒト向け。

* 構成

```
+--------+
|  MQTT  |
+--------+
 |  |   |
 |  |   +--------------------------------------+
 |  |                                          |
 |  +------------------+                       |
 |                     |                       |
+---------------+    +-------------------+   +------------------+
|  Server Page  |	 |  Client Page (1)  |	 |  Client Page (2) |
+---------------+	 +-------------------+	 +------------------+
```

こうじゃなくて！こう！


```
+---------------+               +---------------+
|  Client Page  |------Req----->|  Server Page  |
| (1)表示ページ |<-----Res------|   管理ツール  |
+---------------+	            |               |
                                |               |
+---------------+               |               |
|  Client Page  |------Req----->|               |
|      (2)      |<-----Res------|               |
+---------------+	            +---------------+
```

## How to install
```
% npm install
% npm run jsx:build
% npm start
% open http://localhost/master.html
```

## How to publish message from devices

publish to MQTT broker with message that is formatted below:

```
$ALL/vote
{
  id: ${UNIQUE_REQUEST_ID (e.g. uuid)},
  from: ${DEVICE_ID},
  data: {
    eventType: ${ENUM("swing", "button1", "button2", "button3")}
  }
}
```

## State transitions
![](https://gitlab.stg.devops.nifty.com/sci01173/morifuji-issue/uploads/63d2bb2ca8c18309cca6e05c99652db1/image.png)

## Requirement
* node.js (>= 6)
* mqtt broker (on either your server or cloud like [NIFTY Cloud](http://cloud.nifty.com/service/mqtt.htm) or [CloudMQTT](https://www.cloudmqtt.com/))

## Sources
* lib/master: 管理ダッシュボード用
    * lib/master/rpc.js: mqtt 経由のメッセージやりとり
* lib/slave:  お客様表示用
    * lib/slave/rpc.js: mqtt 経由のメッセージやりとり
* lib/common: 共通パーツ

## TODO
* 終了後にどこかに保存
* 投票の仕方(1回きり、複数回答)が適当
* グラフの表示が適当
