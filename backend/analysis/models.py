from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

from general.models import Tournament, Team, Player, GameMode, Map

class SeriesAnalysis(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    thumbnail = models.CharField(max_length=100, null=True, blank=True)
    winner = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='series_wins')
    played_date = models.DateTimeField(validators=[MaxValueValidator(limit_value=timezone.now)])
    team_one = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_one_series')
    team_two = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_two_series')
    team_one_map_count = models.PositiveIntegerField()
    team_two_map_count = models.PositiveIntegerField()

    def __str__(self):
        return self.title

class MapAnalysis(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    series_analysis = models.ForeignKey(
        SeriesAnalysis,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='maps'
    )
    title = models.CharField(max_length=50)
    thumbnail = models.CharField(max_length=100, null=True, blank=True)
    screenshot = models.CharField(max_length=100)
    team_one = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_one_maps')
    team_two = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_two_maps')
    team_one_score = models.PositiveIntegerField()
    team_two_score = models.PositiveIntegerField()
    winner = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='map_wins')
    played_date = models.DateTimeField(validators=[MaxValueValidator(limit_value=timezone.now)])
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    game_mode = models.ForeignKey(GameMode, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class CustomAnalysis(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=50)
    thumbnail = models.CharField(max_length=100, null=True, blank=True)
    map_analyses = models.ManyToManyField(MapAnalysis, through='CustomAnalysisMapAnalysis')

    def __str__(self):
        return self.title

class CustomAnalysisMapAnalysis(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    custom_analysis = models.ForeignKey(CustomAnalysis, on_delete=models.CASCADE)
    map_analysis = models.ForeignKey(MapAnalysis, on_delete=models.CASCADE)

class PlayerMapPerformance(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    map_analysis = models.ForeignKey(MapAnalysis, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    kills = models.PositiveIntegerField()
    deaths = models.PositiveIntegerField()
    kd_ratio = models.FloatField()
    assists = models.PositiveIntegerField()
    ntk = models.PositiveIntegerField()

class PlayerMapPerformanceHP(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    player_performance = models.OneToOneField(PlayerMapPerformance, on_delete=models.CASCADE)
    highest_streak = models.PositiveIntegerField()
    damage = models.PositiveIntegerField()
    hill_time = models.PositiveIntegerField()
    average_hill_time = models.PositiveIntegerField()
    objective_kills = models.PositiveIntegerField()
    contested_hill_time = models.PositiveIntegerField()
    kills_per_hill = models.FloatField(validators=[MinValueValidator(0)])
    damage_per_hill = models.FloatField(validators=[MinValueValidator(0)])

class PlayerMapPerformanceSND(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    player_performance = models.OneToOneField(PlayerMapPerformance, on_delete=models.CASCADE)
    bombs_planted = models.PositiveIntegerField()
    bombs_defused = models.PositiveIntegerField()
    first_bloods = models.PositiveIntegerField()
    first_deaths = models.PositiveIntegerField()
    kills_per_round = models.FloatField(validators=[MinValueValidator(0)])
    damage_per_round = models.FloatField(validators=[MinValueValidator(0)])

class PlayerMapPerformanceControl(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    player_performance = models.OneToOneField(PlayerMapPerformance, on_delete=models.CASCADE)
    tiers_captured = models.PositiveIntegerField()
    objective_kills = models.PositiveIntegerField()
    offense_kills = models.PositiveIntegerField()
    defense_kills = models.PositiveIntegerField()
    kills_per_round = models.FloatField(validators=[MinValueValidator(0)])
    damage_per_round = models.FloatField(validators=[MinValueValidator(0)])

class PlayerSeriesPerformance(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    series_analysis = models.ForeignKey(SeriesAnalysis, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    total_kills = models.PositiveIntegerField()
    total_deaths = models.PositiveIntegerField()
    series_kd_ratio = models.FloatField(validators=[MinValueValidator(0)])
    total_assists = models.PositiveIntegerField()
    total_ntk = models.PositiveIntegerField()

class PlayerCustomAnalysisPerformance(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    custom_analysis = models.ForeignKey(CustomAnalysis, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    total_kills = models.PositiveIntegerField()
    total_deaths = models.PositiveIntegerField()
    custom_analysis_kd_ratio =  models.FloatField(validators=[MinValueValidator(0)])
    total_assists = models.PositiveIntegerField()
    total_ntk = models.PositiveIntegerField()
