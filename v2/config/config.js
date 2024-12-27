const config = {};

let mode = 'development';

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}

config.development = {
    host: 'http://192.168.200.59'
}

config.production = {
    host: 'https://137.184.116.145' // TODO: buddypond.com
}

config.env = config.development;
if (mode === 'production') {
    config.env = config.production;
}

export default config;