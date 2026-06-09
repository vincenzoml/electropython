from app.python.electropython import api


@api
def greet(name: str = 'Ada') -> str:
    """Return a friendly greeting from Python."""
    return f'Hello, {name}, from Python.'
