// Runs automatically on every Netlify Forms submission and sends a WhatsApp alert via CallMeBot.
// Set CALLMEBOT_APIKEY in Netlify > Site configuration > Environment variables.
const PHONE = "2482663425"; // +248 2663425 (country code, no plus sign)

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body);
    const d = payload.data || {};
    let text;

    if (payload.form_name === "shop-order") {
      text = [
        "🛍️ XVDS SHOP ORDER",
        d.name + " | " + d.phone,
        d.child_and_group ? "Child/group: " + d.child_and_group : "",
        d.order_items,
        "Total: " + d.order_total
      ].filter(Boolean).join("\n");
    } else {
      text = [
        "🩰 NEW HOLIDAY REGISTRATION",
        "Child: " + d.child_name + " (" + (d.group || "-") + ")",
        "Program: " + (d.programs || "-"),
        "Guardian: " + d.guardian_name + " | " + d.phone,
        d.email ? "Email: " + d.email : "",
        d.medical ? "Medical: " + d.medical : ""
      ].filter(Boolean).join("\n");
    }

    const url = "https://api.callmebot.com/whatsapp.php?phone=" + PHONE +
      "&text=" + encodeURIComponent(text) +
      "&apikey=" + encodeURIComponent(process.env.CALLMEBOT_APIKEY || "");
    const r = await fetch(url);
    console.log("CallMeBot status", r.status);
    return { statusCode: 200, body: "ok" };
  } catch (e) {
    console.error(e);
    return { statusCode: 200, body: "error logged" };
  }
};
