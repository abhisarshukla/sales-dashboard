module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'prettier',
    ],
}
