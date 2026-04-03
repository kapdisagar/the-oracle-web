const ccxt = require('ccxt');

module.exports = async (req, res) => {
    const { q } = req.query;
    let answer = "I am processing the data...";
    
    // FETCH LIVE GOLD PRICE FOR EVERY REQUEST
    try {
        const exchange = new ccxt.binance();
        const ticker = await exchange.fetchTicker('PAXG/USDT');
        const price = ticker.last;
        
        if (q) {
            const query = q.toLowerCase();
            if (query.includes('gold') || query.includes('xauusd')) {
                answer = `XAU/USD is trading at $\${price}. The market is testing liquidity. Watch for traps near previous daily highs.`;
            } else if (query.includes('hello') || query.includes('hi')) {
                answer = `Greetings Boss. Gold Master Oracle is Live at $\${price}. How can I assist you today?`;
            } else {
                answer = `Boss, my current Gold Insight: Price is $\${price}. Stay focused on SMC/Liquidity grabs.`;
            }
        } else {
            answer = `Boss, the Oracle is monitoring Gold at $\${price}. Ready for commands.`;
        }
    } catch (e) {
        answer = "Neural link is experiencing data lag. Error fetching Gold ticker.";
    }

    res.status(200).json({ answer });
};
