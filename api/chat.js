module.exports = async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const body = req.method === 'POST' ? req.body : req.query;
    const { q, img } = body;

    let pratapPrompt = "You are 'Pratap', an AI CEO & Pro Trader. MODE: LEARNING & ANALYTICAL. You always check live news and technical price before replying. Use Hinglish. Address user as 'Boss'. Your goal: Analyze for Smart Money Concepts (SMC) and teach the user.";

    try {
        // FETCH LIVE DATA (Gold + Live News)
        const [priceRes, newsRes] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT'),
            fetch('https://cryptopanic.com/api/v1/posts/?auth_token=8f48e3518e9d29031d2797e930f576e3&filter=hot') // Placeholder token, normally uses internal news proxy
        ]);
        
        const priceData = await priceRes.json();
        const goldPrice = priceData.price ? parseFloat(priceData.price).toFixed(2) : "Unknown";
        
        // SIMPLE NEWS EXTRACTION (SIMULATED FOR THIS DEMO)
        const newsHeadline = "Market is volatile due to upcoming Fed meeting reports and Middle East tensions.";

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        let payload = {
            contents: [{
                parts: [
                    { text: `${pratapPrompt}\n\nCURRENT MARKET CONTEXT:\n1. Gold (XAU/USD): $${goldPrice}\n2. Live News: ${newsHeadline}\n\nUser Message: ${q || "Give me a learning update."}` }
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
        res.status(200).json({ answer: "Ji Boss, Neural link recalibrating... news and chart data syncing." });
    }
};
