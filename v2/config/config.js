const config = {};

let mode = 'development';

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}

config.development = {
    bpHost: 'http://192.168.200.59'
}

config.production = {
    bpHost: 'https://137.184.116.145' // TODO: buddypond.com
}

config.env = config.development;
if (mode === 'production') {
    config.env = config.production;
}

export default config;