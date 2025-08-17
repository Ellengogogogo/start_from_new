#!/usr/bin/env python3
"""
Simple test script to verify server startup
"""

import asyncio
import uvicorn
from app.main import app

if __name__ == "__main__":
    print("Testing server startup...")
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            log_level="info"
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()
