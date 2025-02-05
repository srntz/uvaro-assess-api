# Uvaro Assess API

### Setup guide
____

#### Database

1. Install [Docker Desktop](https://docs.docker.com/desktop/). If you have a Mac, enable "Use Rosetta for x86/amd64 emulation" under Settings/General.

2. If you have used the previous image versions, make sure to delete the container and the image before proceeding.

3. Pull the image.
   ```shell
   docker pull srntz/uvaro_assess_postgres
   ```

4. Create a container.
   ```shell
   docker run --name uvaro_db -d -p 5550:5432 -e POSTGRES_PASSWORD=password srntz/uvaro_assess_postgres
   ```
   <br>
   
#### API
1. Clone the repository and install node modules.
    ```
   npm i
   ```
2. Download the [.env file](https://drive.google.com/file/d/1IgLFXX-kruTzaVk52jf0ljgHowZWsmgH/view) and put it into API's root directory.

3. Load the database.
   ```shell
   npm run load
   ```

4. Run the API.
    ```
   npm run start
   ```
   
5. Navigate to [localhost:4000/graphql](http://localhost:4000/graphql). If everything is correct, you should see the Apollo Server client.

6. Try to run a few queries to make sure everything works as it should.
