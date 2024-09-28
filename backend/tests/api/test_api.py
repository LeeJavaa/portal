from datetime import datetime
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.test import TestCase, Client
from unittest.mock import patch

from analysis.models import Analysis, Map, Team
from backend.api import AnalysisIn, AnalysisOut, serialize_analysis

from ninja import Schema

class TestAnalysisAPI(TestCase):
    def setUp(self):
        self.map = Map.objects.create(name="Test Map")
        self.team1 = Team.objects.create(name="Team One")
        self.team2 = Team.objects.create(name="Team Two")
        self.analysis = Analysis.objects.create(
            played_date=datetime.now(),
            input_file="input.txt",
            output_file="output.txt",
            title="Test Analysis",
            map=self.map,
            game_mode="Test Mode",
            start_time=5.56,
            team_one=self.team1,
            team_two=self.team2
        )
        self.valid_payload = {
            "played_date": "2023-01-01T00:00:00Z",
            "input_file": "input.txt",
            "title": "Test Analysis",
            "map": "Test Map",
            "game_mode": "Test Mode",
            "start_time": 1234.56,
            "team_one": "Team One",
            "team_two": "Team Two"
        }

    def test_analysis_out_schema(self):
        schema = AnalysisOut(
            id=1,
            created=datetime.now(),
            last_modified=datetime.now(),
            played_date=datetime.now(),
            input_file="input.txt",
            output_file="output.txt",
            title="Test",
            map="Test Map",
            game_mode="Test Mode",
            start_time=1234.56,
            team_one="Team One",
            team_two="Team Two"
        )
        assert isinstance(schema, Schema)
        assert schema.id == 1
        assert schema.title == "Test"

    def test_analysis_in_schema(self):
        schema = AnalysisIn(
            played_date=datetime.now(),
            input_file="input.txt",
            title="Test",
            map="Test Map",
            game_mode="Test Mode",
            start_time=1234.56,
            team_one="Team One",
            team_two="Team Two"
        )
        assert isinstance(schema, Schema)
        assert schema.title == "Test"
        assert schema.map == "Test Map"

    def test_serialize_analysis(self):
        serialized = serialize_analysis(self.analysis)
        assert serialized['id'] == self.analysis.id
        assert serialized['played_date'] == self.analysis.played_date
        assert serialized['input_file'] == self.analysis.input_file
        assert serialized['output_file'] == self.analysis.output_file
        assert serialized['title'] == self.analysis.title
        assert serialized['map'] == self.map.name
        assert serialized['game_mode'] == self.analysis.game_mode
        assert serialized['start_time'] == self.analysis.start_time
        assert serialized['team_one'] == self.team1.name
        assert serialized['team_two'] == self.team2.name

    def test_get_analyses_success(self):
        response = self.client.get('/api/analyses')
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]['id'] == self.analysis.id

    @patch('analysis.models.Analysis.objects.all')
    def test_get_analyses_failure(self, mock_all):
        # Simulate an exception when fetching analyses
        mock_all.side_effect = Exception("Database error")

        response = self.client.get('/api/analyses')
        assert response.status_code == 500
        data = response.json()
        assert "error" in data
        assert data["error"] == "An error occurred while fetching analyses"

    def test_get_analysis_success(self):
        response = self.client.get(f'/api/analysis/{self.analysis.id}')
        assert response.status_code == 200
        data = response.json()
        assert data['id'] == self.analysis.id
        assert data['title'] == self.analysis.title
        assert data['map'] == self.map.name
        assert data['team_one'] == self.team1.name
        assert data['team_two'] == self.team2.name

    def test_get_analysis_not_found(self):
        non_existent_id = 9999 # be careful about future
        response = self.client.get(f'/api/analysis/{non_existent_id}')
        assert response.status_code == 500
        data = response.json()
        assert "error" in data
        assert data["error"] == f"Error fetching analysis with id {non_existent_id}"

    @patch('backend.api.get_object_or_404')
    def test_get_analysis_failure(self, mock_get_object):
        # Simulate an unexpected exception
        mock_get_object.side_effect = Exception("Unexpected error")

        response = self.client.get(f'/api/analysis/{self.analysis.id}')
        assert response.status_code == 500
        data = response.json()
        assert "error" in data
        assert data["error"] == f"Error fetching analysis with id {self.analysis.id}"

    def test_create_analysis_successful(self):
        response = self.client.post("/api/create_analysis", data=self.valid_payload, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn('id', data)
        self.assertTrue(Analysis.objects.filter(id=data['id']).exists())

    @patch('backend.api.Analysis.objects.create')
    def test_create_analysis_failure(self, mock_create):
        mock_create.side_effect = Exception("Unexpected error")
        response = self.client.post("/api/create_analysis", data=self.valid_payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn('error', data)
        self.assertEqual(data['error'], "Unexpected error")

    @patch('backend.api.Analysis.objects.create')
    def test_create_analysis_integrity_error(self, mock_create):
        mock_create.side_effect = IntegrityError("Duplicate entry")
        response = self.client.post("/api/create_analysis", data=self.valid_payload, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        data = response.json()
        self.assertIn('error', data)
        self.assertIn("Duplicate entry", data['error'])
        self.assertIn("Are you sure you entered everything correctly?", data['error'])

    @patch('backend.api.Analysis.objects.create')
    def test_create_analysis_validation_error(self, mock_create):
        mock_create.side_effect = ValidationError("Invalid data")
        response = self.client.post("/api/create_analysis", data=self.valid_payload, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        data = response.json()
        self.assertIn('error', data)
        self.assertIn("Invalid data", data['error'])
        self.assertIn("Are you sure you entered everything correctly?", data['error'])