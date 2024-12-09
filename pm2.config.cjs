module.exports = {
    apps : [
        {
            name: 'test-socket',  // 应用名称，可自定义
            script: 'tests/server.js',
            instances: '2',  // 设置为'max'表示根据服务器的CPU核心数来确定启动的节点数，也可以指定具体数字，如2、3等
            exec_mode: 'cluster',  // 使用集群模式启动，实现多节点运行
            autorestart: true,  // 应用异常退出时自动重启
            watch: false,  // 是否监控文件变化自动重启应用，这里设置为否，可根据需求调整
            max_memory_restart: '1G',  // 当应用占用内存超过1G时自动重启
            env: {
                NODE_ENV: 'development',
                PORT: 3133 // 在开发环境下设置端口为3001
              },
              env_production: {
                NODE_ENV: 'production',
                PORT: 3133 // 在生产环境下设置端口为8080
              }
        }
    ]
};