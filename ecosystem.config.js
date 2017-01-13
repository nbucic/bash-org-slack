module.exports = {
    apps: [
        // First application
        {
            name: "bashbot",
            script: "./bin/www",
            env: {
                NODE_ENV: "production"
            },
        },

        {
            name: "bashbot-local",
            script: "./bin/www"
        }
    ],

    deploy: {
        production: {
            user: "orioly",
            host: [
                {
                    host: "orioly.com",
                    port: "222"
                }
            ],
            ref: "origin/master",
            repo: "git@github.com:nbucic/bash-org-slack.git",
            path: "/home/orioly/bash-org-slack",
            "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env production --only bashbot"
        }
    }
};