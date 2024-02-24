from api.v1.models import User


def insert_sample_data(db):
    # Add sample users
    sample_users = [
        User(email='user1', password='password1'),
        User(email='user2', password='password2'),
    ]
    db.session.add_all(sample_users)
    db.session.commit()
