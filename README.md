ーーーーーーーーーーーーーーーーーーーーーーーーーーー
ZETA-R3 — MakeCode拡張（micro:bit → ZETA TZM902DP 制御）
この拡張は、micro:bit から ZETA モジュール（TZM902DP）を UART で制御し、
接続状態/品質取得や データ送受信 を簡潔なブロックで実現します。

拡張の追加方法（MakeCode）
・ MakeCode for micro:bit を開く
・ 歯車メニュー → Extensions
・ 検索欄に GitHub リポジトリ URL を貼り付け
    https://github.com/tipyman/zeta_r3
または「Import URL」でも同URLを指定可能です（承認リスト外でもURL指定で読み込みできます）。


追加が完了すると、ツールボックスに ZETA-R3 カテゴリが現れます。

ーーーーーーーーーーーーーーーーーーーーーーーーーーー
ハードウェア構成（必読）
・ UART（115,200bps）
    ・ micro:bit P1(TX) → ZETA RX
    ・ micro:bit P0(RX) → ZETA TX
    ・ UARTをピンで使うため、serial.redirect(P1, P0, 115200) を最初に実行してください。
・ Wakeup 制御: P2（アクティブ"L"）
    ・ 起動時に Low → 10〜20ms → High のパルスでウェイク（関数側で制御します）
・ 通知入力: P8（アクティブ"H"）
    ・ モジュール側からの通知信号を Highパルスで受けます（イベントは pins.onPulsed() が便利）。
・ 占有ピン: P0 / P1 / P2 / P8（他機能と混在不可）

TX/RXはクロス接続です。ボーレートは 115,200bps を使用（MakeCode側の選択肢にあります）。

ーーーーーーーーーーーーーーーーーーーーーーーーーーー
ブロック／API一覧（namespace ZETA_R3）
 主な機能と戻り値を要約します。

送受信（クエリあり／なし）
    // クエリ発行＋応答取得（CRC16 XMODEM付与）
    export function command_assert(txArray: number[]): number[]
    
    // データ送信（クエリあり） → 応答コードを返す（response[3])
    export function data_tx(txArray: number[]): number
    
    // データ送信（クエリなし）
    export function data_tx_noQ(txArray: number[]): void
    
    // 応答データ受信（FA F5 prefix → 長さ → ペイロード）
    export function receive_query(): number[]

・ フレームは FA F5 <len> <cmd> ... <crc16> をベースに構築されます（crc16は XMODEM）。
・ 受信は1バイト単位で serial.readBuffer(1) を用いるため、必要バイトが来るまでブロッキングします。

モジュール情報・状態取得
    // MACアドレス（4バイト）
    export function Inquire_MAC(): number[]
    
    // モジュールステータス（1バイト）
    export function Inquire_Module_Status(): number
    
    // プロトコルバージョン（2バイト結合）
    export function Inquire_Version(): number
    
    // ネットワーク時間（応答の 5〜11 バイト目）
    export function Inquire_Network_Time(): number[]
    
    // ネットワーク品質（1バイト）
    export function Inquire_Network_Quality(): number

ーーーーーーーーーーーーーーーーーーーーーーーーーーー
使い方（TypeScriptサンプル）
1) 初期化と基本クエリ
    // --- UART を P1/P0 に切替（115200bps） ---
    serial.redirect(SerialPin.P1, SerialPin.P0, BaudRate.BaudRate115200) // 必須

    // Wakeup（アクティブL）： 最初は"H"にしておく
    pins.digitalWritePin(DigitalPin.P2, 1)
    
    // 通知ピンの設定（High パルスを検出）
    pins.setPull(DigitalPin.P8, PinPullMode.PullDown) // 既定はLow、Highで通知を捉えるpins.onPulsed(DigitalPin.P8, PulseValue.High, function () {    basic.showString("NTF") // 通知イベント（例）})// ↑ onPulsed は実機でのみ動作します（シミュレータ非対応）。[4](https://makecode.microbit.org/reference/pins/on-pulsed)// プロトコルバージョンとステータスconst ver = ZETA_R3.Inquire_Version()const st  = ZETA_R3.Inquire_Module_Status()basic.showString(`V=${ver}`)basic.showNumber(st)// ネットワーク品質const q = ZETA_R3.Inquire_Network_Quality()basic.showString(`Q=${q}`)// MACアドレス表示const mac = ZETA_R3.Inquire_MAC()basic.showString(mac.map(b => b.toString(16).padStart(2, "0")).join(""))その他の行を表示する

serial.redirect() とボーレート指定は USB→ピンUART の切替に必要です。
pins.onPulsed() は指定ピンの High/Lowパルスでイベントを起動します。 [makecode.com] [makecode.m...crobit.org]

2) データ送信（クエリあり／なし）
TypeScript// 送信ペイロード（例）const payload = [0x01, 0x02, 0xA5, 0x5A]// クエリあり送信 → 応答コード（response[3]）を取得input.onButtonPressed(Button.A, function () {    const code = ZETA_R3.data_tx(payload)    basic.showString(`TX:${code}`)})// クエリなし送信（応答不要な用途）input.onButtonPressed(Button.B, function () {    ZETA_R3.data_tx_noQ(payload)    basic.showString("TX-Only")})``その他の行を表示する
3) 低レベルフレーム送信（command_assert）
TypeScript// 任意コマンドフレームの送信（CRCは関数内で自動付与）const cmd = [0xfa, 0xf5, 0x03, 0x10] // 例: MAC取得const resp = ZETA_R3.command_assert(cmd)// 応答先頭は [FA, F5, len, ...]if (resp.length >= 4 && resp[0] == 0xFA && resp[1] == 0xF5) {    basic.showString("OK")} else {    basic.showString("ERR")}``その他の行を表示する

典型的な注意点 / トラブルシュート

ピン競合: 本拡張は P0/P1/P2/P8 を占有します。他の拡張・機能で同ピンを使わないでください。
シリアルの切替: UART をピンで使うには serial.redirect(P1, P0, 115200) が必須です。USBのままでは外部モジュールに送受信されません。 [makecode.com]
受信のブロッキング: serial.readBuffer(1) は指定バイトが届くまで待機します。メインループを詰まらせたくない場合、readBuffer(0) とバッファ処理に切り替える設計が有効です。 [github.com]
通知ピン（P8）: モジュールが High レベルで通知する場合、PullDown を設定しておくと Low→High の遷移が明確になります。イベント検出には pins.onPulsed() が簡便です。 [makecode.m...crobit.org], [makecode.m...crobit.org]
TX/RXクロス接続: micro:bit TX(P1)→ZETA RX / micro:bit RX(P0)→ZETA TX。
電源/GND: GND 共通は必須。電源電圧/電流はモジュール仕様に準拠。


ライセンス / リンク

GitHub（拡張）: https://github.com/tipyman/zeta_r3
MakeCode: https://makecode.microbit.org/（拡張の読み込みはGitHub URLから可能） [fredscave.com]
（推奨）ライセンス: MIT


補足：MakeCode拡張の運用ヒント

拡張は GitHub から 動的ロード されます。承認リスト外でも URL直接指定で読み込めます。 [fredscave.com], [github.com]
ピンUART利用時のボーレート指定やUSB↔ピンの切替は serial.redirect() を用います（115200bps可）。 [makecode.com]
シリアルの読み取り動作（同期/非同期）は readBuffer(length) の仕様に従います。
