GIT_USER_NAME=
GIT_PASSWORD=
BRANCH=
SERVICE_NAME=
REPO_PATH=
REPO_NAME=
PORT=3000
buildDocker()
{
    sudo rm -rf $REPO_NAME
    sudo git clone -b $BRANCH https://$GIT_USER_NAME:$GIT_PASSWORD@$REPO_PATH
    cd ~/$REPO_NAME
}
buildDocker
docker-compose up -d