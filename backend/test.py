import pytest
from main import app

@pytest.fixture
def client():
  app.config['TESTING'] = True
  with app.test_client() as client:
    yield client

def test_app_is_working(client):
  response = client.get('/tasks')
  assert response.status_code == 200