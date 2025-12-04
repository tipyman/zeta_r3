> このページを開く [https://tipyman.github.io/zeta_r3/](https://tipyman.github.io/zeta_r3/)

## 拡張機能として使用

このリポジトリは、MakeCode で **拡張機能** として追加できます。

* [https://makecode.microbit.org/](https://makecode.microbit.org/) を開く
* **新しいプロジェクト** をクリックしてください
* ギアボタンメニューの中にある **拡張機能** をクリックしてください
* **https://github.com/tipyman/zeta_r3** を検索してインポートします。

## このプロジェクトを編集します


# ZETA-R3 MakeCode拡張

このMakeCode拡張は、micro:bitを使用して **ZETA-R3モジュール**とUART通信を行うためのブロックを提供します。  
ZETAコマンド送信、応答受信、モジュール情報の取得（MACアドレス、プロトコルバージョン、ネットワーク状態など）をサポートします。

---

#### 特徴
- UARTによるバイナリ通信
- CRC16（XMODEM）によるデータ整合性チェック
- センサーデータ送信
- モジュールステータスやMACアドレスの取得
- ネットワーク時間・品質の取得

---

* [https://makecode.microbit.org/](https://makecode.microbit.org/) を開く
* **読み込む** をクリックし、 **URLから読み込む...** をクリックしてください
* **https://github.com/tipyman/zeta_r3** を貼り付けてインポートをクリックしてください

#### メタデータ (検索、レンダリングに使用)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

### **ZETAコマンド送信**
Send ZETA command [リスト]
任意のZETAコマンドを送信し、応答データを受信します。

---

### **ZETAデータ送信**

Transmit ZETA data [リスト]
センサーデータをZETAモジュールに送信します。
応答状況を返します。

---

### **MACアドレス取得**

Get MAC address
4バイトのMACアドレスを配列で返します。

---

### **モジュールステータス取得**

Get Module Status
モジュールの状態コードを返します。

---

### **プロトコルバージョン取得**

Get Protocol Version
プロトコルバージョンを数値で返します。

---

### **ネットワーク時間取得**

Get Network Time
ネットワーク時間を配列で返します（5～11バイト目）。

---

### **ネットワーク品質取得**

Get Network Quality
ネットワーク品質指標を返します。

---

### **応答データ受信**

Receive Query Data
モジュールからの応答データを配列で返します。

---

## インストール方法
1. MakeCode for micro:bit を開きます。
2. **拡張**をクリックします。
3. `https://github.com/<あなたのリポジトリ名>` を入力して追加します。