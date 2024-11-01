from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from nba_booksdata import getBestPropsNBA
from mls_booksdata import getBestPropsMLS
from euros2024_booksdata import getBestPropsEuros
from wnba_booksdata import getBestPropsWNBA
from mlb_booksdata import getBestPropsMLB
from epl_booksdata import getBestPropsEPL
from laliga_booksdata import getBestPropsLaLiga
from cfb_booksdata import getBestPropsCFB
from nfl_booksdata import getBestPropsNFL

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


@app.get("/api/best-props-nba")
async def read_best_props_nba(include_prizepicks: bool = Query(True)):
    return getBestPropsNBA(include_prizepicks)


@app.get("/api/best-props-mls")
async def read_best_props_mls():
    return getBestPropsMLS()


@app.get("/api/best-props-epl")
async def read_best_props_epl():
    return getBestPropsEPL()


@app.get("/api/best-props-laliga")
async def read_best_props_laliga():
    return getBestPropsLaLiga()


@app.get("/api/best-props-euros")
async def read_best_props_euros():
    return getBestPropsEuros()


@app.get("/api/best-props-wnba")
async def read_best_props_wnba(include_prizepicks: bool = Query(True)):
    return getBestPropsWNBA(include_prizepicks)


@app.get("/api/best-props-mlb")
async def read_best_props_mlb(include_prizepicks: bool = Query(True)):
    return getBestPropsMLB(include_prizepicks)


@app.get("/api/best-props-cfb")
async def read_best_props_cfb(include_prizepicks: bool = Query(True)):
    return getBestPropsCFB(include_prizepicks)


@app.get("/api/best-props-nfl")
async def read_best_props_nfl(include_prizepicks: bool = Query(True)):
    return getBestPropsNFL(include_prizepicks)


# @app.get("/api/top-projections")
# async def top_projections_endpoint():
#     return get_top_projections()
