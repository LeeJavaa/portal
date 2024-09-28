from django.test import TestCase
from django.utils import timezone

from analysis.models import Map, Team, Player, Analysis

class TestAnalysisModels(TestCase):
     def setUp(self):
         self.map = Map.objects.create(name="Test Map")
         self.team1 = Team.objects.create(name="Team One")
         self.team2 = Team.objects.create(name="Team Two")
         self.player = Player.objects.create(name="Test Player", team=self.team1)
         self.analysis = Analysis.objects.create(
             played_date = timezone.now(),
             input_file = "input.txt",
             output_file = "output.txt",
             title = "Test Analysis",
             map = self.map,
             game_mode = "Test Mode",
             start_time = 5.00,
             team_one = self.team1,
             team_two = self.team2
         )

     def test_map_str(self):
         self.assertEqual(str(self.map), "Test Map")

     def test_team_str(self):
         self.assertEqual(str(self.team1), "Team One")
         self.assertEqual(str(self.team2), "Team Two")

     def test_player_str(self):
         self.assertEqual(str(self.player), "Test Player")

     def test_analysis_str(self):
         self.assertEqual(str(self.analysis), "Test Analysis")