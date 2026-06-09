from collections.abc import Callable, AsyncGenerator
from typing import Any

API_REGISTRY: dict[str, Callable[..., Any]] = {}
STREAM_REGISTRY: dict[str, Callable[..., AsyncGenerator[Any, None]]] = {}


def api(func: Callable[..., Any]) -> Callable[..., Any]:
    """Register a Python function as an ElectroPython API."""
    API_REGISTRY[func.__name__] = func
    return func


def stream(func: Callable[..., AsyncGenerator[Any, None]] | None = None, *, interval: float | None = None):
    """Register a Python async generator as an ElectroPython stream."""
    def decorate(inner):
        STREAM_REGISTRY[inner.__name__] = inner
        return inner
    return decorate(func) if func is not None else decorate
