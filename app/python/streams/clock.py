import asyncio
from datetime import datetime
from app.python.electropython import stream


@stream
async def clock():
    """Emit the current time once per second."""
    while True:
        yield {'now': datetime.now().isoformat()}
        await asyncio.sleep(1)
