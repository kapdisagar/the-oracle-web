module.exports = async (req, res) => {
    const { q } = req.query;
    let answer = "I am processing the Gold data...";
    
    try {
        // High-speed direct fetch from Binance
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        const data = await response.json();
        const price = data.price ? parseFloat(data.price).toFixed(2) : "0.00";
        
        if (q) {
            const query = (q || "").toLowerCase();
            if (query.includes('gold') || query.includes('xauusd')) {
                answer = `XAU/USD is currently at $\${price}. I see a potential liquidity sweep. Monitor the 15m chart carefully.`;
            } else if (query.includes('hi') || query.includes('hello')) {
                answer = `Greetings Boss. Gold is at $\${price}. The Oracle is steady and ready.`;
            } else {
                answer = `Boss, my current Gold Insight: Price is $\${price}. Trend is Master.`;
            }
        } else {
            answer = `The Oracle is monitoring Gold at $\${price}. Ready for commands.`;
        }
    } catch (e) {
        answer = "Still experiencing a slight neural delay. I am recalibrating the link...";
    }

    res.status(200).json({ answer });
};
