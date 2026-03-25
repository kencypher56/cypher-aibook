import platform
import subprocess
import sys

def detect_system():
    info = {
        "os": platform.system(),
        "python": sys.version,
        "gpu_available": False,
        "gpu_name": None,
        "device": "cpu"
    }
    try:
        import torch
        if torch.cuda.is_available():
            info["gpu_available"] = True
            info["gpu_name"] = torch.cuda.get_device_name(0)
            info["device"] = "cuda"
    except Exception:
        pass
    if not info["gpu_available"]:
        info["device"] = "cpu"
    return info

def get_device():
    try:
        import torch
        if torch.cuda.is_available():
            return "cuda"
    except Exception:
        pass
    return "cpu"
