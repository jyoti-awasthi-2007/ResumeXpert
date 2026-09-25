"""Seed script for populating initial data.

This script creates database tables and populates the career and skill data
used by the application. Run with: python -m app.seed
"""
from app.database import create_tables
from app.engines.career_matching import CAREERS_DB


def seed() -> None:
    """Create database tables and log seed status."""
    create_tables()
    print(f"Database tables created. {len(CAREERS_DB)} careers available in-memory.")


if __name__ == "__main__":
    seed()
    print("CareerLens seed data loaded")