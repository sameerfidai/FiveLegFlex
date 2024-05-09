from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from booksdata import getBestProps

app = FastAPI()

# Configure allowed origins
origins = [
    "http://localhost:3000",  # For local development
    "https://five-leg-flex.vercel.app/",  # Replace with your deployed frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/best-props")
async def read_best_props():
    return getBestProps()
