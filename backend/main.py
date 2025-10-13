from fastapi import FastAPI

from router import api_router


app = FastAPI(docs_url="/api")

app.include_router(api_router)
