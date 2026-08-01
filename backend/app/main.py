from fastapi import FastAPI
from app.api.evaluation import router as evalution_router
from app.api.batch_evaluation import router as batch_router
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
# Routing for single evaluation
app.include_router(
    evalution_router,
    prefix="/api/v1/evaluations",
    tags=["Evaluations"]
)
# Routing for batch evaluation
app.include_router(
    batch_router,
    # prefix="/api/v1/batch_evaluation",
    # tags=["Batch Evaluation"]
)

@app.get("/test")
def fun():
    return "App is running"

@app.get("/")
def home():
    return{
       "message":"App is running"
    } 