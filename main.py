
from fastapi import FastAPI
import uvicorn
import user

app = FastAPI(
    title="Solaris",
    description="we will be first"
)

app.include_router(user.router)

if __name__ == "__main__":
    uvicorn.run("main:app, reload = True")


