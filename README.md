# Uvaro Assess API

### Quickstart

1. Clone the repository and install node modules
    ```
   npm i
   ```
2. Download the .env file and put it into API's root directory
3. Create the database container with the following command
    ```shell
   docker run --name uvaro_db -d -p 5550:5432 -e POSTGRES_PASSWORD:password srntz/uvaro_assess_postgres
    ```
4. Run the API
    ```
   npm run start
   ```
5. Navigate to localhost:3000/graphql. If everything is correct, you should see the Apollo Server client.
6. Try to run a few queries to make sure everything works as it should.
