from django.db import models

class Team(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    code = models.CharField(max_length=4, db_index=True)
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name

class Player(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    full_name = models.CharField(max_length=50, null=True, blank=True)
    gamertag_clean = models.CharField(max_length=15, db_index=True)
    gamertag_dirty = models.CharField(max_length=15, db_index=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    def __str__(self):
        return self.gamertag_clean

class GameMode(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    code = models.CharField(max_length=3)
    name = models.CharField(max_length=15)

    def __str__(self):
        return self.name

class Map(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Tournament(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=50)
    played_date = models.DateField(db_index=True)