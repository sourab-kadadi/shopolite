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

sudo docker run --name $SERVICE_NAME -itd --net="host" \
-e PORT=$PORT \
-e DATABASE_USER=$DATABASE_USER \
-e DATABASE_PASSWORD=$DATABASE_PASSWORD \
-e DB_HOST=$DB_HOST \
-e S3_ACCESS_KEY= \
-e S3_SECRATE_KEY= \
-e S3_BUCKET_NAME= \
-e S3_REGION=ap-south-1 \
-e REDIS_HOST= \
-e REDIS_PORT= \
-e ACCESS_TOKEN_EXPIRY=1 \
-e REFRESH_TOKEN_EXPIRY=3 \
-e ACCESS_TOKEN_IAT=5 \
-e REFRESH_TOKEN_IAT=2 \
-e ACCESS_TOKEN_SECRATE= \
-e REFRESH_TOKEN_SECRATE= \
--restart unless-stopped \
$SERVICE_NAME:latest;



echo "Deploy Complete";
echo $(sudo docker ps);