from fastapi import FastAPI
from app.api.evaluation import router as evalution_router
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(
     title="AI response evaluator",
     description="Backend for evaluating LLM Responses",
     version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    evalution_router,
    prefix="/api/v1/evaluations",
    tags=["Evaluations"]
)

@app.get("/test")
def fun():
    return "App is running"

@app.get("/")
def home():
    return{
       "message":"App is running"
    } 