const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "payment.html"));
});

app.get("/payment", (req, res) => {
res.sendFile(path.join(__dirname, "payment.html"));
});

app.get("/server-test", (req, res) => {
res.json({
ok: true,
message: "Server is running"
});
});

app.get("/telegram-test", async (req, res) => {
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
return res.status(500).json({
ok: false,
message: "Telegram settings are missing"
});
}


try {
    const response = await fetch(
        "https://api.telegram.org/bot" +
        TELEGRAM_BOT_TOKEN +
        "/sendMessage",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: "Telegram connection successful"
            })
        }
    );

    const data = await response.json();
    res.json(data);

} catch (error) {
    res.status(500).json({
        ok: false,
        error: error.message
    });
}


});

app.post("/notify", async (req, res) => {
const {
productName,
productNumber,
applicationDate,
serialNumber
} = req.body;


if (
    !productName ||
    !productNumber ||
    !applicationDate ||
    !serialNumber
) {
    return res.status(400).json({
        ok: false,
        message: "Missing required fields"
    });
}

const message =
    "طلب جديد\n\n" +
    "الاسم: " + String(productName).slice(0, 100) + "\n" +
    "رقم الطلب: " + String(productNumber).slice(0, 50) + "\n" +
    "التاريخ: " + String(applicationDate).slice(0, 30) + "\n" +
    "الحالة: " + String(serialNumber).slice(0, 30);

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.json({
        ok: true,
        message: "Received successfully"
    });
}

try {
    const response = await fetch(
        "https://api.telegram.org/bot" +
        TELEGRAM_BOT_TOKEN +
        "/sendMessage",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        }
    );

    const data = await response.json();

    if (!data.ok) {
        return res.status(500).json({
            ok: false,
            message: "Telegram notification failed"
        });
    }

    res.json({
        ok: true,
        message: "Notification sent"
    });

} catch (error) {
    res.status(500).json({
        ok: false,
        message: error.message
    });
}


});

app.listen(PORT, "0.0.0.0", () => {
console.log("=================================");
console.log("SERVER RUNNING");
console.log("Port: " + PORT);
console.log("=================================");
});
