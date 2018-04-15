module.exports = {
    'secret': 'thisissomerandomsecretkey',
    'database': 'mongodb://xylops:1234@ds133251.mlab.com:33251/poll_template',
    //refresh users token every 5 minutes
    'tokenExpiredIn': 300,
    //forced user to do a relogin every 6 hours
    'forceExpired':4800
};
