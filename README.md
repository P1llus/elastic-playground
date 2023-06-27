## Elastic Playground

Currently an in-progress app that will include multiple tools and snippets, first tool currently being created is the Ingest Pipeline Builder.

The current state of this app is that it is not ready for public consumption just yet, **its unstable, errors are to be expected and the code is not structured well**.

### Starting the App

Everything runs inside docker containers (Custom ES build and the webservice), to try it out, follow these steps:

1. Clone the repository
2. Rename `.env.example` to `.env`, no need to modify any values at this stage, as it requires the local ES running in docker to function properly.
3. Start with `docker-compose up`
