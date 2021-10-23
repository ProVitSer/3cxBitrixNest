module.exports = {
    apps: [{
        name: "3CX-Bitrix24",
        script: "./dist/main.js",
        exec_mode: "cluster",
        instances: 5,
        autorestart: true,
        watch: false,
        log_date_format: "YYYY-MM-DD HH:mm Z",
        env: {
            NODE_ENV: "prod"
        },
    }]
}