from fastapi import FastAPI
from routers.mortgages import router as mortgages

app = FastAPI()

@app.get("/")
def root():
    return {"message": "RMBS Backend"}

app.include_router(mortgages, prefix="/api", tags=["Mortgages"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
