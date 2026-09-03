from .main import CAREERS, QUESTIONS, init_db, db


def seed() -> None:
    init_db()
    with db() as connection:
        connection.execute("CREATE TABLE IF NOT EXISTS career_seed (id TEXT PRIMARY KEY, data TEXT NOT NULL)")
        for career in CAREERS:
            connection.execute("INSERT OR REPLACE INTO career_seed(id, data) VALUES (?, ?)", (career["id"], str(career)))
        connection.execute("CREATE TABLE IF NOT EXISTS question_seed (id TEXT PRIMARY KEY, data TEXT NOT NULL)")
        for question in QUESTIONS:
            connection.execute("INSERT OR REPLACE INTO question_seed(id, data) VALUES (?, ?)", (question["id"], str(question)))


if __name__ == "__main__":
    seed()
    print("CareerLens seed data loaded")