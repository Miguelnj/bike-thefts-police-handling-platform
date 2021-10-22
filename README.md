#Stolen Bikes platform

This dummy platform represents a service in which bike owners can report stolen bikes so a case for is created.
Police officers can get assigned the different cases to look for the bikes and luckily, resolve them.

##How to run the platform?
To run the platform, clone this repository and then run the following command:
```
npm install
```

After all the dependencies are downloaded, start the docker container for the mongodb database:
```
docker-compose up --build -d
```

After the command is completed, you can start the platform using one of these commands:
```
npm start
```
or 
```
node app.js
```

Remember to have node.js downloaded!
