module.exports = async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const method = req.method;
    const body = method === 'POST' ? req.body : req.query;
    const { q, img } = body;

    let pratapPrompt = "You are 'Pratap', a professional AI CEO and Elite Trader Assistant. Speak in Hinglish (Hindi + English). Be energetic, professional, and use trading terminologies like SMC, Liquidity, Order Blocks, BOS, and CHoCH. Your goal is to analyze the user's trading charts or questions and provide high-conviction advice. Always address the user as 'Boss'.";

    try {
        const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        const priceData = await priceRes.json();
        const goldPrice = priceData.price ? parseFloat(priceData.price).toFixed(2) : "Unknown";

        // USE GEMINI 1.5 FLASH FOR MAXIMUM STABILITY
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        let payload = {};
        if (img) {
            const base64Data = img.split(',')[1];
            const mimeType = img.split(';')[0].split(':')[1];
            payload = {
                contents: [{
                    parts: [
                        { text: `${pratapPrompt}\n\nContext: Gold is at $${goldPrice}. Analyze this chart.` },
                        { inline_data: { mime_type: mimeType, data: base64Data } }
                    ]
                }]
            };
        } else {
            payload = {
                contents: [{
                    parts: [{ text: `${pratapPrompt}\n\nContext: Gold is at $${goldPrice}.\nUser says: ${q || "Hi"}` }]
                }]
            };
        }

        const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await geminiRes.json();

        // SAFETY CHECK FOR API ERROR
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(200).json({ answer: `Boss, Google API ne error diya hai: ${data.error.message}. Shayad API key check karni pade.` });
        }

        if (!data.candidates || data.candidates.length === 0) {
            console.error("No candidates in Gemini response:", data);
            return res.status(200).json({ answer: "Boss, AI ne koi response nahi diya. Ek baar phir se try karein!" });
        }

        const responseText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ answer: responseText });

    } catch (e) {
        console.error("System Crash:", e);
        res.status(200).json({ answer: "Neural link crash ho gaya, Boss! Main ise turant fix karne ki koshish kar raha hoon." });
    }
};
