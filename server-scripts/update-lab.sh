ssh admin@lab.cargografias.org "
    cd /opt/lab
    pm2 stop lab
    git pull
    npm install
    bower install
    echo 'Current version is:'
    git rev-parse --short HEAD
    git rev-parse --short HEAD > web/version.txt 
    pm2 restart lab
"
