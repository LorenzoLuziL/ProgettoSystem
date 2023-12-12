"""Entrypoint."""

import os
import re

from configargparse import ArgumentTypeError
from typing import Any, Mapping

from .logging import LoggingConfigurator


def common_config(settings: Mapping[str, Any]):
    """Perform common app configuration."""
    # Set up logging
    log_config = settings.get("log.config")
    log_level = settings.get("log.level") or os.getenv("LOG_LEVEL")
    log_file = settings.get("log.file")
    LoggingConfigurator.configure(log_config, log_level, log_file)


class ByteSize:
    """Argument value parser for byte sizes."""

    def __init__(self, min_size: int = 0, max_size: int = 0):
        """Initialize the ByteSize parser."""
        self.min_size = min_size
        self.max_size = max_size

    def __call__(self, arg: str) -> int:
        """Interpret the argument value."""
        if not arg:
            raise ArgumentTypeError("Expected value")
        parts = re.match(r"^(\d+)([kKmMgGtT]?)[bB]?$", arg)
        if not parts:
            raise ArgumentTypeError("Invalid format")
        size = int(parts[1])
        suffix = parts[2].upper()
        if suffix == "K":
            size = size << 10
        elif suffix == "M":
            size = size << 20
        elif suffix == "G":
            size = size << 30
        elif suffix == "T":
            size = size << 40
        if size < self.min_size:
            raise ArgumentTypeError(
                f"Size must be greater than or equal to {self.min_size}"
            )
        if self.max_size and size > self.max_size:
            raise ArgumentTypeError(
                f"Size must be less than or equal to {self.max_size}"
            )
        return size

    def __repr__(self):
        """Format for in error reporting."""
        return self.__class__.__name__
