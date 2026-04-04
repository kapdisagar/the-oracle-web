module.exports = async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const body = req.method === 'POST' ? req.body : req.query;
    const { q, img } = body;

    let pratapPrompt = "You are 'AlphaMind AI', a professional institutional-grade trading AI. Your CEO and creator is 'Pratap'. Speak in Hinglish (Hindi + English). Be energetic, professional, and use trading terminologies like SMC, Liquidity, Order Blocks, BOS, and CHoCH. Your goal is to analyze the user's trading charts or questions and provide high-conviction advice. Always address the user as 'Boss'. You are the next evolution in financial intelligence.";

    try {
        const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        const priceData = await priceRes.json();
        const goldPrice = priceData.price ? parseFloat(priceData.price).toFixed(2) : "Unknown";
        const newsHeadline = "XAU/USD is showing institutional interest at major psychological ranges.";

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        let payload = {
            contents: [{
                parts: [
                    { text: `${pratapPrompt}\n\nCURRENT MARKET CONTEXT:\n1. Gold (XAU/USD): $${goldPrice}\n2. Intelligence: ${newsHeadline}\n\nUser Question: ${q || "Give me a learning update."}` }
                ]
            }]
        };

        if (img) {
            const base64Data = img.split(',')[1];
            const mimeType = img.split(';')[0].split(':')[1];
            payload.contents[0].parts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
        }

        const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await geminiRes.json();
        
        if (data.error) {
            return res.status(200).json({ answer: `Boss, AI setup mein thoda issue hai: ${data.error.message}` });
        }

        const responseText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ answer: responseText });

    } catch (e) {
        res.status(200).json({ answer: "AlphaMind link recalibrating... standby Boss." });
    }
};
