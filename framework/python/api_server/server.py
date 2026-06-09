from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import app.python.startup  # noqa: F401
from app.python.electropython import API_REGISTRY, STREAM_REGISTRY

app = FastAPI(title='ElectroPython Python Capability Server')


class ApiCall(BaseModel):
    payload: dict = {}


@app.get('/health')
def health():
    return {
        'ok': True,
        'runtime': 'python',
        'apis': sorted(API_REGISTRY.keys()),
        'streams': sorted(STREAM_REGISTRY.keys())
    }


@app.post('/api/{name}')
def call_api(name: str, call: ApiCall):
    func = API_REGISTRY.get(name)
    if not func:
        raise HTTPException(status_code=404, detail=f'Unknown Python API: {name}')
    result = func(**call.payload)
    return {'ok': True, 'result': result}
