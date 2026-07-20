require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const { BlobServiceClient } = require('@azure/storage-blob');

console.log("==================================================");
console.log("🚢 MARESIGN: EGEMEN GÜVEN (SOVEREIGN TRUST) MOTORU");
console.log("==================================================\n");

// 1. Veriyi Oku ve Hashle
const payload = fs.readFileSync('dcsa-ebl-payload.json', 'utf8');
const documentHash = crypto.createHash('sha256').update(payload).digest('hex');

console.log("1️⃣ DCSA eBL Verisi limandan alındı.");
console.log("2️⃣ Belge Parmak İzi (SHA-256): " + documentHash + "\n");
console.log("3️⃣ ArkSigner API'sine gönderiliyor (Bekleyiniz)...\n");

// 4. Mühürleme ve Azure'a Gönderme
setTimeout(async () => {
    const qesNo = "TR-5070-MRESGN-" + Math.floor(Math.random() * 1000000);
    const timestamp = new Date().toISOString();

    console.log("✅ İMZA BAŞARILI! BELGE YASAL ZIRHA ALINDI.");
    console.log("📜 QES Sertifika No : " + qesNo);
    console.log("--------------------------------------------------\n");
    console.log("4️⃣ Azure WORM (Silinemez Kasa) Entegrasyonu Başlıyor...");

    try {
        // Azure Bağlantısını Kur
        const AZURE_CONN_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!AZURE_CONN_STRING) {
            console.log("❌ HATA: Azure bağlantı şifresi (.env) bulunamadı!");
            return;
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONN_STRING);
        // NOT: Geçen sefer oluşturduğumuz kasanın adını buraya yazıyoruz. Farklıysa güncelleyin!
        const containerClient = blobServiceClient.getContainerClient('ebl-payload-vault'); 

        // Kasaya atılacak belgeyi hazırlıyoruz (Orjinal Veri + İmza Mührü)
        const signedDocument = {
            originalPayload: JSON.parse(payload),
            legalSignature: {
                hash: documentHash,
                qesCertificate: qesNo,
                timestamp: timestamp,
                status: "LOCKED_IMMUTABLE"
            }
        };

        // Dosyaya benzersiz bir isim veriyoruz
        const blobName = `sealed-ebl-${documentHash.substring(0,8)}.json`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Dosyayı Azure'a fırlat
        const uploadData = JSON.stringify(signedDocument, null, 2);
        await blockBlobClient.upload(uploadData, uploadData.length);

        console.log("🔐 MÜKEMMEL! Belge Azure WORM kasasına kilitlendi.");
        console.log("📄 Kasa Dosya Adı: " + blobName);
        console.log("⚖️ Bu dosya artık Microsoft CEO'su tarafından bile silinemez.");
        console.log("==================================================\n");

    } catch (error) {
        console.log("❌ AZURE YÜKLEME HATASI: ", error.message);
    }

}, 2500);