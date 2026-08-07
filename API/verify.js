// ✅ API للتحقق من المفاتيح - Vercel Serverless

// المفاتيح المؤقتة (في التطبيق الحقيقي استخدم قاعدة بيانات)
const tempKeys = {
    // "USER123": { password: "Pass@123", created_at: "2026-08-07T00:00:00.000Z" }
};

module.exports = async (req, res) => {
    // ✅ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                ok: false,
                error: 'Username and password are required'
            });
        }

        // ✅ التحقق من المفتاح
        if (tempKeys[username] && tempKeys[username].password === password) {
            // ✅ التحقق من الصلاحية (24 ساعة)
            const created = new Date(tempKeys[username].created_at);
            const now = new Date();
            const diffHours = (now - created) / (1000 * 60 * 60);

            if (diffHours > 24) {
                delete tempKeys[username];
                return res.status(401).json({
                    ok: false,
                    error: 'Key has expired. Request a new one from the bot.'
                });
            }

            return res.status(200).json({
                ok: true,
                message: 'Login successful',
                user: username
            });
        }

        return res.status(401).json({
            ok: false,
            error: 'Invalid username or password'
        });

    } catch (error) {
        console.error('Verify API error:', error);
        return res.status(500).json({
            ok: false,
            error: 'Internal server error'
        });
    }
};
