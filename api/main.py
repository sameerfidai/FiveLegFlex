from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from api.nba_booksdata import getBestPropsNBA

# from scrape_props_selenium import get_top_projections

app = FastAPI()

# Configure allowed origins
origins = [
    "http://localhost:3000",  # For local development
    "https://five-leg-flex.vercel.app",
    "https://www.fivelegflex.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/best-props")
async def read_best_props_nba(include_prizepicks: bool = Query(True)):
    return getBestPropsNBA(include_prizepicks)


# @app.get("/api/top-projections")
# async def top_projections_endpoint():
#     return get_top_projections()
