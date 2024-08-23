
from fastapi import FastAPI
import uvicorn
import user
from data.db import init_db

app = FastAPI(
    title="Solaris",
    description="we will be first"
)


@app.on_event("startup")
async def start_db():
    await init_db()
    

app.include_router(user.router)


if __name__ == "__main__":
    uvicorn.run("main:app, reload = True")


