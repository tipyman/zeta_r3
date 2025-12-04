/**
* makecode ZETA(R3) module Package Release 1
* By 2025 Socionext Inc. and ZETA alliance Japan
* Written by M.Urade　2025/12/4
*/

/**
* ZETA(R3) block Ver1
*/
//% weight=100 color=#0096FF icon="\uf434" block="ZETA-R3"

namespace ZETA_R3 {
    const txBuffer = pins.createBuffer(1);

    pins.digitalWritePin(DigitalPin.P2, 0);  // Wakeup off

    /**
     * UARTで1バイト送信
     * @param txData 送信する8bitデータ
     */
    function UART_BIN_TX(txData: number): void {
        txBuffer.setUint8(0, txData);
        serial.writeBuffer(txBuffer);
    }

    /**
     * UARTで1バイト受信
     * @returns 受信データ（8bit）、タイムアウト時は0x100
     */
    function UART_BIN_RX(): number {
        const rxBuffer = serial.readBuffer(1);
        if (rxBuffer.length > 0) {
            return rxBuffer[0];
        }
        return 0x100; // Timeout indicator
    }

    /**
     * CRC16 XMODEM計算
     * @param data データ配列
     * @returns CRC16値
     */
    function crc16(data: number[]): number {
        let crc = 0x0000;
        for (let i = 0; i < data.length; i++) {
            crc ^= (data[i] << 8);
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc <<= 1;
                }
                crc &= 0xFFFF;
            }
        }
        return crc;
    }

    /**
     * ZETAコマンド送信と応答受信
     * @param txArray 送信データ配列
     * @returns 応答データ配列
     */
    //% blockId=ZETA_command_assert block="Send ZETA command %txArray"
    //% txArray.shadow="lists_create_with"
    export function command_assert(txArray: number[]): number[] {
        pins.digitalWritePin(DigitalPin.P2, 0);  // Wakeup on
        basic.pause(20); // The specification requires 10ms, but use 20ms for safety

        const originalLength = txArray.length;
        const crcTarget = txArray.slice(2);
        const crcValue = crc16(crcTarget);
        txArray.push((crcValue >> 8) & 0xff);
        txArray.push(crcValue & 0xff);

        for (let i = 0; i < originalLength + 2; i++) {
            UART_BIN_TX(txArray[i]);
        }

        basic.pause(100);
        pins.digitalWritePin(DigitalPin.P2, 1);  // Wakeup off

        return receive_query();
    }

    /**
     * データ送信
     * @param txArray データ配列
     * @returns 応答コード
     */
    //% blockId=ZETA_data_tx block="Transmit ZETA data %txArray"
    //% txArray.shadow="lists_create_with"
    export function data_tx(txArray: number[]): number {
        const header = [0xfa, 0xf5, txArray.length + 3, 0x02];
        const response = command_assert(header.concat(txArray));
        return response[3];
    }

    /**
     * MACアドレス取得
     */
    //% blockId=ZETA_inquire_mac block="Get MAC address"
    export function Inquire_MAC(): number[] {
        const response = command_assert([0xfa, 0xf5, 0x03, 0x10]);
        return [response[4], response[5], response[6], response[7]];
    }

    /**
     * モジュールステータス取得
     */
    //% blockId=ZETA_inquire_status block="Get Module Status"
    export function Inquire_Module_Status(): number {
        const response = command_assert([0xfa, 0xf5, 0x03, 0x14]);
        return response[3];
    }

    /**
     * プロトコルバージョン取得
     */
    //% blockId=ZETA_inquire_version block="Get Protocol Version"
    export function Inquire_Version(): number {
        const response = command_assert([0xfa, 0xf5, 0x03, 0x00]);
        return (response[4] << 8) + response[5];
    }

    /**
     * ネットワーク時間取得（5～11バイト目）
     */
    //% blockId=ZETA_inquire_network_time block="Get Network Time"
    export function Inquire_Network_Time(): number[] {
        return command_assert([0xfa, 0xf5, 0x03, 0x11]).slice(4, 11);
    }

    /**
     * ネットワーク品質取得
     */
    //% blockId=ZETA_inquire_network_quality block="Get Network Quality"
    export function Inquire_Network_Quality(): number {
        const response = command_assert([0xfa, 0xf5, 0x03, 0x13]);
        return response[4];
    }

    /**
     * 応答データ受信
     * @returns 応答データ配列
     */
    //% blockId=ZETA_receive_query block="Receive Query Data"
    export function receive_query(): number[] {
        const response = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let timeoutCounter = 0;

        while (true) {
            const data = UART_BIN_RX();
            if (data === 0xfa) break;
            timeoutCounter++;
            if (timeoutCounter > 15) return response; // Timeout
        }

        if (UART_BIN_RX() === 0xf5) {
            response[0] = 0xfa;
            response[1] = 0xf5;
            const length = UART_BIN_RX();
            response[2] = length;

            for (let i = 0; i < length; i++) {
                response[3 + i] = UART_BIN_RX();
            }
        }
        return response;
    }
}