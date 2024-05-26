from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from booksdata import getBestProps

app = FastAPI()

# Configure allowed origins
origins = [
    "http://localhost:3000",  # For local development
    "https://five-leg-flex.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/best-props")
async def read_best_props(include_prizepicks: bool = Query(True)):
    return getBestProps(include_prizepicks)
