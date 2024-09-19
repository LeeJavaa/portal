from django.db import models

class Map(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Team(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Player(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    class Meta:
        indexes = [
            models.Index(fields=['team']),
        ]

    def __str__(self):
        return self.name

class Analysis(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    played_date = models.DateTimeField(db_index=True)
    input_file = models.CharField(max_length=255)
    output_file = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    game_mode = models.CharField(max_length=255, db_index=True)
    start_time = models.FloatField()  # Using FloatField for PSIF (assuming it's a floating-point number)
    team_one = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_one_analyses')
    team_two = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_two_analyses')

    class Meta:
        indexes = [
            models.Index(fields=['played_date']),
            models.Index(fields=['map']),
            models.Index(fields=['game_mode']),
            models.Index(fields=['team_one']),
            models.Index(fields=['team_two']),
        ]

    def __str__(self):
        return self.title