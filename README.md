This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the API server in `/api`:

```bash
# if you have Docker

# build Docker image
docker build -t fivelegflex .

# run server
docker run -p 8080:8080 fivelegflex


#if you do NOT have Docker
cd api

# create and activate python virtual environment
python -m venv venv
source venv/bin/activate

# install dependencies
pip install -r requirements.txt

# run API server
uvicorn main:app --reload
```

Second, run the development server in `/frontend`:

```bash
cd frontend

# install dependencies
npm install

# run development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.