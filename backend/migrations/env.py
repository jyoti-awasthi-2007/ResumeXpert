from alembic import context
from sqlalchemy import create_engine

config = context.config
database_url = config.get_main_option("sqlalchemy.url")


def run_migrations_online():
    engine = create_engine(database_url)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=None)
        with context.begin_transaction():
            context.run_migrations()


run_migrations_online()