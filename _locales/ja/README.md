# ZETA-R3 MakeCode Extension

This MakeCode extension provides blocks to communicate with **ZETA-R3 modules** via UART on micro:bit.  
It supports sending commands, receiving responses, and querying module information such as MAC address, protocol version, and network status.

---

#### Features
- Send ZETA commands with CRC16 (XMODEM)
- Transmit sensor data
- Query module status and MAC address
- Get protocol version, network time, and network quality
- UART binary communication support

---

## Blocks Overview

### **Transmit ZETA Command**
Send ZETA command [list]
Send a custom ZETA command array and receive the response.

---

### **Transmit ZETA Data**

Transmit ZETA data [list]
Send sensor data to the ZETA module.

---

### **Get MAC Address**

Get MAC address
Returns an array of 4 bytes representing the MAC address.

---

### **Get Module Status**

Get Module Status
Returns the module status code.

---

### **Get Protocol Version**

Get Protocol Version
Returns the protocol version as a number.

---

### **Get Network Time**

Get Network Time
Returns an array representing the network time (bytes 5–11).

---

### **Get Network Quality**

Get Network Quality
Returns the network quality indicator.

---

### **Receive Query Data**

Receive Query Data
Receives and returns the raw response array from the module.

---

## Installation
1. Open MakeCode for micro:bit.
2. Click **Extensions**.
3. Search for `https://github.com/<your-repo-name>` and add it.
