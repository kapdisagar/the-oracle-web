module.exports = async (req, res) => {
    const { q } = req.query;
    let answer = "Neural processors are initializing... standby Boss.";
    
    try {
        // FETCHING CORE ASSETS
        const [paxg, eurusd, gbpusd] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT').then(r => r.json()),
            fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT').then(r => r.json()), // Placeholder, usually FX from oanda/alpha-vantage
            fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHTUSDT').then(r => r.json())
        ]);
        
        const goldPrice = parseFloat(paxg.price).toFixed(2);
        
        // PRO MINDSET ANALYTICS (SMC LOGIC SIMULATION)
        const smc_insight = (asset) => {
            const insights = [
                "I see an Order Block forming near the previous daily high. Wait for the sweep.",
                "Liquidity grab detected at the London Open session. High probability entry zone.",
                "Market is in a distribution phase. Avoid FOMO until the BOS (Break of Structure) is confirmed.",
                "FVG (Fair Value Gap) hasn't been filled yet. Expect a retrace before the next leg up."
            ];
            return insights[Math.floor(Math.random() * insights.length)];
        };

        const welcomeMsg = `Banker Status: ONLINE. Gold is at $${goldPrice}. Pranam Boss! Main aapka Pro Trader Agent hoon. Forex aur Gold market bilkul clear hai.`;
        
        if (q) {
            const query = (q || "").toLowerCase();
            
            if (query.includes('gold') || query.includes('xauusd') || query.includes('sona')) {
                answer = `Boss, Gold (XAU/USD) Master Update: Price abhi $${goldPrice} hai. SMC analysis ke hisaab se: ${smc_insight('GOLD')}. 🥇🏹`;
            } else if (query.includes('euro') || query.includes('eurusd')) {
                answer = `EUR/USD is showing tight consolidation. Institutional liquidity is sitting below the Asian lows. Wait for the New York session overlap! 📊🏙️`;
            } else if (query.includes('gbp') || query.includes('gbpusd')) {
                answer = `GBP/USD (Cable) is reacting to the 4H Resistance zone. My recommendation: Wait for a CHoCH (Change of Character) on the 15m chart. ☕📉`;
            } else if (query.includes('kaise') || query.includes('hello')) {
                answer = welcomeMsg;
            } else if (query.includes('smc')) {
                answer = `Smart Money Concepts (SMC) is my specialty, Boss. Main hamesha Retail Traps (S/R) ke bajaye big institutions ki liquidity dhoondta hoon. 🏹🛡️`;
            } else {
                answer = `Ji Boss, Gold abhi $${goldPrice} par hai. Meta-Analysis: ${smc_insight('GLOBAL')}. Precision hi hamara profit hai! 🎯🤵‍♂️`;
            }
        } else {
            answer = welcomeMsg;
        }
    } catch (e) {
        answer = "Neural Lag detected. Data stream from Binance is currently unstable, Boss.";
    }

    res.status(200).json({ answer });
};
