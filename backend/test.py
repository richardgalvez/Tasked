from fastapi.testclient import TestClient
import pytest
from main import app

# Testing simple connection
@pytest.fixture
def client():
  with TestClient(app) as client:
    yield client

def test_app_is_working(client):
  response = client.get('/tasks')
  assert response.status_code == 200