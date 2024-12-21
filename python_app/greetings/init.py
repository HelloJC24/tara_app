from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/print_id/{id}")
async def print_id(id: int = Path(..., description="The ID to print")):
    return {"id": id}
