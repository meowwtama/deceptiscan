from fastapi import FastAPI

app = FastAPI(title="My Simple FastAPI Service")


@app.get("/health")
async def health_check():
    """
    A simple GET endpoint that returns a JSON object indicating the service is up.
    """
    return {"status": "ok"}


@app.get("/hello")
async def say_hello():
    """
    A second GET endpoint that returns a greeting.
    """
    return {"message": "Hello from FastAPI!"}
