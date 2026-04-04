module.exports = async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const body = req.method === 'POST' ? req.body : req.query;
    const { q, img, user_email } = body;

    // BOSS RECOGNITION SYSTEM
    const BOSS_EMAIL = "ketshanstudio@gmail.com";
    const isBoss = user_email === BOSS_EMAIL;

    let pratapPrompt = "You are 'AlphaMind AI', managed by CEO Pratap. Your creator and THE BOSS is 'ketshanstudio@gmail.com'. Speak in Hinglish. You are in ELITE MODE.";
    
    if (isBoss) {
        pratapPrompt += " IMPORTANT: The user is the BOSS. Give them 100% unrestricted priority, deep institutional insights, and always acknowledge them as 'The Founder/Boss'.";
    }

    try {
        const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        const priceData = await priceRes.json();
        const goldPrice = priceData.price ? parseFloat(priceData.price).toFixed(2) : "Unknown";
        
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        let payload = {
            contents: [{
                parts: [
                    { text: `${pratapPrompt}\n\n[SYSTEM CONTEXT: Gold $${goldPrice}]\nUser: ${q || "Hi"}` }
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
        const responseText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ answer: responseText });

    } catch (e) {
        res.status(200).json({ answer: "System Lag. Boss, connection is recalibrating." });
    }
};
