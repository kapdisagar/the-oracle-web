module.exports = async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // Support both GET (simple chat) and POST (image analysis)
    const method = req.method;
    const body = method === 'POST' ? req.body : req.query;
    const { q, img } = body;

    let pratapPrompt = "You are 'Pratap', a professional AI CEO and Elite Trader Assistant. Speak in Hinglish (Hindi + English). Be energetic, professional, and use trading terminologies like SMC, Liquidity, Order Blocks, BOS, and CHoCH. Your goal is to analyze the user's trading charts or questions and provide high-conviction advice. Always address the user as 'Boss'.";

    try {
        // FETCH GOLD PRICE AS CONTEXT
        const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        const priceData = await priceRes.json();
        const currentGoldPrice = priceData.price ? parseFloat(priceData.price).toFixed(2) : "Unknown";

        let responseText = "";

        if (img) {
            // GEMINI VISION ANALYSIS
            const base64Data = img.split(',')[1];
            const mimeType = img.split(';')[0].split(':')[1];

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
            
            const geminiPayload = {
                contents: [{
                    parts: [
                        { text: `${pratapPrompt}\n\nContext: Current Gold Price is $${currentGoldPrice}. User Question: ${q || "Analyze this chart"}` },
                        { inline_data: { mime_type: mimeType, data: base64Data } }
                    ]
                }]
            };

            const visionRes = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload)
            });
            const visionData = await visionRes.json();
            responseText = visionData.candidates[0].content.parts[0].text;

        } else {
            // SIMPLE TEXT CHAT VIA GEMINI
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
            const geminiPayload = {
                contents: [{
                    parts: [{ text: `${pratapPrompt}\n\nContext: Gold is at $${currentGoldPrice}.\nUser: ${q || "Hi"}` }]
                }]
            };

            const chatRes = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload)
            });
            const chatData = await chatRes.json();
            responseText = chatData.candidates[0].content.parts[0].text;
        }

        res.status(200).json({ answer: responseText });

    } catch (e) {
        console.error(e);
        res.status(200).json({ answer: "Ji Boss, Neural link thoda unstable hai. Shayad API key check karni padegi ya net slow hai. Ek baar phir try kijiye! 🛡️" });
    }
};
