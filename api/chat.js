module.exports = async (req, res) => {
    const { q } = req.query;
    let answer = "Ji Boss, main data analyze kar raha hoon... Bas ek minute.";
    
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT');
        const data = await response.json();
        const price = data.price ? parseFloat(data.price).toFixed(2) : "0.00";
        
        if (q) {
            const query = (q || "").toLowerCase();
            
            if (query.includes('gold') || query.includes('xauusd') || query.includes('sona')) {
                answer = `Boss, Gold abhi $\${price} par hai. Market mein thodi halchal hai, mere hisaab se abhi liquidity sweep ka intezar karna chahiye. 15m chart par nazar rakhein, jaldbaazi nahi karni! 🏹🥇`;
            } else if (query.includes('hi') || query.includes('hello') || query.includes('kaise ho')) {
                answer = `Pranam Boss! Main bilkul fit hoon aur Gold par kadi nazar rakhe hue hoon. Order kab dena hai, bas aapka ishara chahiye! 🤵‍♂️🎬`;
            } else if (query.includes('profit') || query.includes('paisa')) {
                answer = `Paisa toh banega Boss! Bas discipline aur market psychology ka khel hai. Gold Master (Oracle) aapke saath hai. 💸📉`;
            } else {
                answer = `Ji Boss, aapne sahi kaha. Gold abhi $\${price} par hai. Mere session ke hisaab se abhi "Wait and Watch" mode best hai. Trend hamesha hamara friend hota hai! 🛡️📊`;
            }
        } else {
            answer = `Main haazir hoon Boss! Gold $\${price} par chal raha hai. Kya report chahiye aapko?`;
        }
    } catch (e) {
        answer = "Maafi chahta hoon Boss, Neural link thoda lag kar raha hai. Main recalibrate kar raha hoon...";
    }

    res.status(200).json({ answer });
};
