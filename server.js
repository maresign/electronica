require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
app.use(cors()); // Tarayıcı ile konuşmaya izin ver
app.use(express.json());

// Kaptan Köşkü'nden gelecek sinyali dinleyen liman: /api/seal
app.post('/api/seal', async (req, res) => {
    try {
        console.log("⚡ Kaptan Köşkü'nden emir geldi! İşlem başlatılıyor...");

        // 1. Veriyi Oku ve Hashle
        const payload = fs.readFileSync('dcsa-ebl-payload.json', 'utf8');
        const documentHash = crypto.createHash('sha256').update(payload).digest('hex');
        
        // 2. ArkSigner Simülasyonu
        const qesNo = "TR-5070-MRESGN-" + Math.floor(Math.random() * 1000000);
        const timestamp = new Date().toISOString();

        // 3. Azure'a Gönder
        const AZURE_CONN_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONN_STRING);
        const containerClient = blobServiceClient.getContainerClient('ebl-payload-vault');
        
        const signedDocument = {
            originalPayload: JSON.parse(payload),
            legalSignature: { hash: documentHash, qesCertificate: qesNo, timestamp: timestamp, status: "LOCKED_IMMUTABLE" }
        };

        const blobName = `sealed-ebl-${documentHash.substring(0,8)}.json`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        const uploadData = JSON.stringify(signedDocument, null, 2);
        await blockBlobClient.upload(uploadData, uploadData.length);
        
        console.log("✅ Başarılı! Azure Kasa Dosyası:", blobName);

        // 4. Kaptan Köşküne Gerçek Verileri (Cevap) Gönder
        res.json({ 
            success: true, 
            hash: documentHash, 
            qes: qesNo, 
            time: timestamp 
        });

    } catch (error) {
        console.log("❌ HATA:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Makineyi 3000 portunda çalıştır
app.listen(3000, () => {
    console.log("==================================================");
    console.log("🚢 MARESIGN API TELGRAFI DEVREDE (Port: 3000)");
    console.log("👉 Artık index.html üzerinden butona basabilirsiniz.");
    console.log("==================================================");
});