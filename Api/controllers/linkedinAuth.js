const fetch = require('node-fetch');

const linkedinCallback = async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).json({ error: 'Authorization code or state missing' });
    }

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });

    try {
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok) {
            const accessToken = tokenData.access_token;

            const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const profileData = await profileResponse.json();

            const userProfile = {
                firstName: profileData.given_name,
                lastName: profileData.family_name,
                email: profileData.email,
                linkedInId: profileData.sub,
            };

            // Redirect to frontend with user data
            const redirectUrl = new URL('http://localhost:3000/auth/callback');
            redirectUrl.searchParams.append('accessToken', accessToken);
            redirectUrl.searchParams.append('firstName', userProfile.firstName);
            redirectUrl.searchParams.append('lastName', userProfile.lastName);
            redirectUrl.searchParams.append('email', userProfile.email);

            return res.redirect(redirectUrl.toString());
        } else {
            return res.status(400).json({ 
                error: tokenData.error_description || 'Failed to get access token' 
            });
        }
    } catch (error) {
        console.error('Error exchanging authorization code:', error);
        return res.status(500).json({ error: 'Error exchanging authorization code' });
    }
};

const initiateLinkedInAuth = (req, res) => {
    const scope = 'openid profile email';
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', process.env.LINKEDIN_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', process.env.LINKEDIN_REDIRECT_URI);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scope);

    res.redirect(authUrl.toString());
};

module.exports = {
    linkedinCallback,
    initiateLinkedInAuth
};