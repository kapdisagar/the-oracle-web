module.exports = async (req, res) => {
    const { q } = req.query;
    let answer = "Ji Boss, main Gold ka rate check kar raha hoon...";
    
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        const data = await response.json();
        const price = data.price ? parseFloat(data.price).toFixed(2) : "Fetching...";
        
        const welcomeMsg = "Pranam Boss! Main bilkul fit hoon aur Gold par kadi nazar rakhe hue hoon. Gold abhi $" + price + " par chal raha hai. 🎯🥈";
        const goldMsg = "Boss, Gold abhi $" + price + " par hai. Mere hisaab se NY open ka wait kijie, wahan badi movement mil sakti hai! 🏹🥇";
        const profitMsg = "Paisa toh banega Boss! Gold abhi $" + price + " par hai. Psychology focus rakhein! 📈🥇";

        if (q) {
            const query = (q || "").toLowerCase();
            if (query.includes('gold') || query.includes('xauusd') || query.includes('sona')) {
                answer = goldMsg;
            } else if (query.includes('hi') || query.includes('hello') || query.includes('kaise ho')) {
                answer = welcomeMsg;
            } else if (query.includes('profit') || query.includes('paisa')) {
                answer = profitMsg;
            } else {
                answer = "Ji Boss, aapne sahi kaha. Gold abhi $" + price + " par hai. Trend hamesha hamara friend hai! 🛡️📊";
            }
        } else {
            answer = "Main haazir hoon Boss! Gold aur Trading Psychology, dono par meri nazar hai. 🏹🥇";
        }
    } catch (e) {
        answer = "Neural link is lagging slightly. Boss, Gold ticker refresh hone mein thoda time lag raha hai.";
    }

    res.status(200).json({ answer });
};
