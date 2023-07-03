## Elastic Playground

Currently an in-progress app that will include multiple tools and snippets, first tool currently being created is the Ingest Pipeline Builder.

### Starting the App

Everything runs inside docker containers (Custom ES build and the webservice), to try it out, follow these steps:

1. Clone the repository
2. Rename `.env.example` to `.env`, no need to modify any ES values.
3. If you want to use the Azure OpenAI features, modify the .env with the information for your deployment.
4. Start with `docker-compose up`
